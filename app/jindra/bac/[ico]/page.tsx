import KalkulacePage from "@/app/kalkulace/page"
import { COMPANY_PRESETS } from "@/app/kalkulace/presets"

// /jindra/bac/{ico} — kalkulačka nabrandovaná podle IČO (logo + údaje podnikatele),
// s vlastním odděleným úložištěm. Např. /jindra/bac/21693021 = instance Fenchak.
// Vizitka je na /jindra/bac/{ico}/vizitka. Odkaz je přímý (neveřejný v UI).
export default function BacIcoPage({ params }: { params: { ico: string } }) {
  return <KalkulacePage presetCompany={COMPANY_PRESETS[params.ico]} storageNamespace={params.ico} />
}
