/**
 * The programme's type and colour system for lectures.
 *
 * One quiet grey base, one accent (the jar's cobalt), one highlight (amber),
 * on a dark ground. The highlight is reserved for the people layer and for
 * reveals, so a learner can read "amber means a person or an answer" without
 * a key. System fonts only: nothing is downloaded at render time.
 */
export const theme = {
  bg: '#14171c',
  panel: '#1c2027',
  panelLine: '#2b313a',
  base: '#a6adb6', // quiet grey text
  baseDim: '#636b76', // secondary text, outlines
  land: '#232830', // land fill
  landLine: '#3a414c', // land outline
  sea: '#14171c',
  accent: '#5a86d6', // cobalt: objects (solid) and materials (dashed)
  accentDim: '#3b5a91',
  skill: '#8e97a3', // skills: dotted grey
  highlight: '#e2a85b', // amber: people, reveals, "argued" marks
  white: '#eceef1',
  danger: '#c86f6f', // used only for the "not recorded" tag border
  font: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Liberation Sans", "DejaVu Sans", sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", "DejaVu Sans Mono", monospace',
  size: {
    title: 64,
    h1: 44,
    h2: 30,
    body: 26,
    small: 20,
    tiny: 16,
  },
} as const;

/** Flow styles on the map and in chains: the one legend every lecture shares. */
export const flowStyle = {
  object: {stroke: theme.accent, dash: [] as number[], label: 'Object'},
  material: {stroke: theme.accent, dash: [18, 12], label: 'Material'},
  skill: {stroke: theme.skill, dash: [4, 10], label: 'Skill'},
  route: {stroke: theme.baseDim, dash: [2, 8], label: 'Route'},
  people: {stroke: theme.highlight, dash: [3, 9], label: 'People (named where recorded)'},
} as const;

export type FlowKind = keyof typeof flowStyle;

export const confidenceWord: Record<string, string> = {
  documented: 'documented',
  probable: 'probable',
  contested: 'argued',
  interpretive: 'we read it as',
  'not recorded': 'not recorded',
};
