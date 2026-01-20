import { capitalise, HasCategory, HasData, HasItem, HasItems, HasItemsArray, HasKind, KeyOf, keysOf } from "@ns-sg/types";

const GRAPH_CASES_MAP = {
  "pr media overlap": [
    "press release",
    "media release",
    "press coverage",
    "media coverage",
    "press outreach",
    "media outreach",
    "journalist outreach"
  ],
  "content seo overlap": [
    "SEO strategy",
    "SEO analytics",
    "content strategy",
    "content marketing",
    "search analytics",
    "keyword strategy"
  ],
  "analytics metrics cluster": [
    "traffic analytics",
    "user analytics",
    "performance metrics",
    "traffic metrics",
    "user metrics",
    "engagement metrics"
  ],
  "publishing workflow": [
    "article publishing",
    "content publishing",
    "article distribution",
    "content distribution",
    "publishing workflow",
    "editorial workflow"
  ],
  "marketing channels": [
    "email marketing",
    "social media marketing",
    "content marketing",
    "digital marketing",
    "marketing analytics",
    "campaign analytics"
  ],
  "newsroom management": [
    "newsroom management",
    "media management",
    "content management",
    "editorial management",
    "newsroom workflow",
    "media workflow"
  ],
  "distribution and reach": [
    "content distribution",
    "press distribution",
    "media distribution",
    "audience reach",
    "distribution channels",
    "media channels"
  ],
  "dashboard reporting": [
    "analytics dashboard",
    "reporting dashboard",
    "performance dashboard",
    "user reporting",
    "platform analytics"
  ],
  "campaign lifecycle": [
    "campaign planning",
    "campaign execution",
    "campaign analytics",
    "marketing planning",
    "performance analytics",
    "execution workflow"
  ],
  "mixed control set": [
    "press release",
    "content strategy",
    "analytics dashboard",
    "email marketing",
    "media coverage",
    "distribution channels",
    "user engagement"
  ]
} as const satisfies Record<string, string[]>

type GRAPH_CASES_MAP = typeof GRAPH_CASES_MAP
export type GraphCaseCategory = KeyOf<GRAPH_CASES_MAP>

export type GraphCaseData<
  K extends GraphCaseCategory = GraphCaseCategory
> =
  & HasCategory<K>
  & HasItemsArray<GRAPH_CASES_MAP[K]>



// ========================================
export const GraphCase_KEYS = keysOf(GRAPH_CASES_MAP)


export const getGraphCaseData = <
  K extends GraphCaseCategory = GraphCaseCategory
>(
  category: K
): GraphCaseData<K> => ({
  category
  , items: GRAPH_CASES_MAP[category]
})

