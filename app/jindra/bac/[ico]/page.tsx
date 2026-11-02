import KalkulacePage from "@/app/kalkulace/page"
import { COMPANY_PRESETS, resolveCompanyKey } from "@/app/kalkulace/presets"

// /jindra/bac/{ico} — kalkulačka nabrandovaná podle IČO (logo + údaje podnikatele),
// s vlastním odděleným úložištěm. Např. /jindra/bac/21693021 = instance Fenchak.
// Vizitka je na /jindra/bac/{ico}/vizitka. Odkaz je přímý (neveřejný v UI).
export default function BacIcoPage({ params }: { params: { ico: string } }) {
  // /jindra/bac/fenchak je alias na IČO – profil i úložiště jsou stejné
  const key = resolveCompanyKey(params.ico)
  return <KalkulacePage presetCompany={COMPANY_PRESETS[key]} storageNamespace={key} />
}
