/**
 * Překlad životopisu pro CV Studio na /jindra/cvapp.
 *
 * Klíč k Anthropic API žije jen tady na serveru — nikdy se nedostane do
 * prohlížeče. Editor je veřejný, proto je požadavek omezený velikostí,
 * počtem za hodinu i za den a stropem pro celý web dohromady.
 */

import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

import { buildTranslateSystemPrompt } from "@/lib/cv/translate-prompt"
import {
  MAX_CHARS,
  MAX_ITEMS,
  checkRateLimit,
  isAllowedOrigin,
} from "@/lib/cv/translate-limits"

// Překlad podle glosáře je mechanická práce — nejlevnější model bohatě stačí.
const MODEL = "claude-haiku-4-5"
const MAX_TOKENS = 8000

const RequestSchema = z.object({
  targetLanguage: z.enum(["cs", "en"]),
  items: z
    .array(z.object({ id: z.string().min(1).max(200), source: z.string().max(4000) }))
    .min(1)
    .max(MAX_ITEMS),
})

const ResponseSchema = z.object({
  translations: z.array(z.object({ id: z.string(), text: z.string() })),
})

const OUTPUT_JSON_SCHEMA = {
  type: "object",
  properties: {
    translations: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, text: { type: "string" } },
        required: ["id", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["translations"],
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
    return fail("Překlad není nastavený — chybí ANTHROPIC_API_KEY.", 501)
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

  const { targetLanguage, items } = parsed.data

  const totalChars = items.reduce((sum, item) => sum + item.source.length, 0)
  if (totalChars > MAX_CHARS) {
    return fail(`Text je příliš dlouhý (${totalChars} znaků, limit ${MAX_CHARS}). Přelož ho prosím po částech.`, 413)
  }

  const client = new Anthropic({ apiKey })

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildTranslateSystemPrompt(targetLanguage),
      output_config: { format: { type: "json_schema", schema: OUTPUT_JSON_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `Přelož každou položku a vrať stejná id.\n\n${JSON.stringify(items, null, 2)}`,
        },
      ],
    })

    if (message.stop_reason === "refusal") {
      return fail("Model odmítl obsah zpracovat. Zkus překládat menší část textu.", 422)
    }

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")

    const result = ResponseSchema.safeParse(JSON.parse(text))
    if (!result.success) {
      return fail("Model vrátil odpověď v nečekaném tvaru. Zkus to prosím znovu.", 502)
    }

    // nikdy nepřijmeme pole, které jsme neposlali
    const requested = new Set(items.map((item) => item.id))
    const translations = result.data.translations.filter((entry) => requested.has(entry.id))

    return Response.json({ ok: true, translations })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return fail("Klíč k překladové službě je neplatný.", 401)
    }
    if (error instanceof Anthropic.RateLimitError) {
      return fail("Překročený limit požadavků. Zkus to za chvíli znovu.", 429)
    }
    if (error instanceof Anthropic.APIError) {
      return fail(`Překladová služba vrátila chybu ${error.status}.`, 502)
    }
    return fail("Překlad se nezdařil.", 500)
  }
}
