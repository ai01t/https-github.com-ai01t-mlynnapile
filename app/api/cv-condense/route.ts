/**
 * Stručná verze životopisu pro CV Studio na /jindra/cvapp.
 *
 * Stejná pravidla jako u překladu: klíč k Anthropic API zůstává na serveru,
 * editor je veřejný, takže požadavek je omezený velikostí i počtem — sdílí
 * přitom stejné počítadlo jako překlad, aby se limit nedal obejít tím, že se
 * střídají dvě routy.
 */

import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

import { buildCondenseSystemPrompt } from "@/lib/cv/condense-prompt"
import { MAX_CHARS, MAX_ITEMS, checkRateLimit, isAllowedOrigin } from "@/lib/cv/translate-limits"

// Na rozdíl od překladu je tohle úsudek, co je pro roli nejméně podstatné.
const MODEL = "claude-haiku-4-5"
const MAX_TOKENS = 8000

const RequestSchema = z.object({
  language: z.enum(["cs", "en"]),
  targetRole: z.string().max(200).default(""),
  items: z
    .array(
      z.object({
        path: z.string().min(1).max(200),
        kind: z.enum(["paragraph", "bullet"]),
        context: z.string().max(300),
        text: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(MAX_ITEMS),
})

const ResponseSchema = z.object({
  decisions: z.array(z.object({ path: z.string(), text: z.string(), drop: z.boolean() })),
})

const OUTPUT_JSON_SCHEMA = {
  type: "object",
  properties: {
    decisions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          path: { type: "string" },
          text: { type: "string" },
          drop: { type: "boolean" },
        },
        required: ["path", "text", "drop"],
        additionalProperties: false,
      },
    },
  },
  required: ["decisions"],
  additionalProperties: false,
} as const

function fail(message: string, status: number, headers?: HeadersInit) {
  return Response.json({ ok: false, error: message }, { status, headers })
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "neznámá"
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return fail("Požadavek nepřišel z tohoto webu.", 403)
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return fail("Zkracování není nastavené — chybí ANTHROPIC_API_KEY.", 501)
  }

  const verdict = checkRateLimit(clientIp(request))
  if (!verdict.ok) {
    return fail(verdict.reason, 429, { "retry-after": String(verdict.retryAfter) })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return fail("Požadavek není platný JSON.", 400)
  }

  const parsed = RequestSchema.safeParse(payload)
  if (!parsed.success) {
    return fail("Neplatný požadavek.", 400)
  }

  const { language, targetRole, items } = parsed.data

  const totalChars = items.reduce((sum, item) => sum + item.text.length, 0)
  if (totalChars > MAX_CHARS) {
    return fail(
      `Text je příliš dlouhý (${totalChars} znaků, limit ${MAX_CHARS}). Zkrať ho prosím po částech.`,
      413,
    )
  }

  const client = new Anthropic({ apiKey })

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildCondenseSystemPrompt(language, targetRole),
      output_config: { format: { type: "json_schema", schema: OUTPUT_JSON_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `Zkrať tyto položky životopisu a vrať rozhodnutí ke každé z nich se stejným "path".\n\n${JSON.stringify(
            items,
            null,
            2,
          )}`,
        },
      ],
    })

    if (message.stop_reason === "refusal") {
      return fail("Model odmítl obsah zpracovat. Zkus zkrátit menší část životopisu.", 422)
    }

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    const result = ResponseSchema.safeParse(JSON.parse(text))
    if (!result.success) {
      return fail("Model vrátil odpověď v nečekaném tvaru. Zkus to prosím znovu.", 502)
    }

    // nikdy nepřijmeme cestu, kterou jsme neposlali
    const requested = new Set(items.map((item) => item.path))
    const decisions = result.data.decisions.filter((entry) => requested.has(entry.path))

    return Response.json({ ok: true, decisions })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return fail("Klíč ke službě je neplatný.", 401)
    }
    if (error instanceof Anthropic.RateLimitError) {
      return fail("Překročený limit požadavků. Zkus to za chvíli znovu.", 429)
    }
    if (error instanceof Anthropic.APIError) {
      return fail(`Služba vrátila chybu ${error.status}.`, 502)
    }
    return fail("Zkrácení se nezdařilo.", 500)
  }
}
