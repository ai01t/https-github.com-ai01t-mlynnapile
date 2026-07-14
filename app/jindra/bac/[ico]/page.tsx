import KalkulacePage from "@/app/kalkulace/page"
import { COMPANY_PRESETS } from "@/app/kalkulace/presets"

// /jindra/bac/{ico} — kalkulačka nabrandovaná podle IČO (logo + údaje podnikatele).
// Např. /jindra/bac/21693021 = kalkulačka Fenchak. Vizitka je na /jindra/bac/{ico}/vizitka.
export default function BacIcoPage({ params }: { params: { ico: string } }) {
  return <KalkulacePage presetCompany={COMPANY_PRESETS[params.ico]} />
}
