/**
 * The data a lecture is written in. `src/lectures/<unit>.json` follows this
 * shape; the Station runner reads it. Most of a lecture is therefore data:
 * narration text, timings and visual commands. Only mechanism moments need
 * hand-written code in the scene file.
 */
import type {Place} from './WorldMap';

export interface LectureData {
  id: string;
  unit: string;
  title: string;
  subtitle?: string;
  fps: number;
  places: Place[];
  /** Seconds for the title card. */
  titleSeconds: number;
  stations: StationData[];
  closing: ClosingData;
}

export interface StationData {
  id: string;
  n: number;
  title: string;
  /** The one idea, for the transcript and the contact sheet. */
  idea: string;
  /** Planned length in seconds; the runner pads to it. */
  seconds: number;
  /** The narration, chaptered; used by scripts/narrate.py and the transcript. */
  narration: string;
  claims: string[];
  objects?: string[];
  /** Which reader must clear it before G3, if any (spec §9). */
  held?: string;
  commands: Command[];
}

export interface ClosingData {
  seconds: number;
  questions: QuestionData[];
}

export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  answer: number;
  claim: string;
  /** How the answer is shown. */
  show: Command[];
}

export type Command =
  | {at: number; do: 'chapter'; n: number; title: string}
  | {at: number; do: 'note'; text: string; seconds: number}
  | {at: number; do: 'caption'; text: string; claim?: string; confidence?: string}
  | {at: number; do: 'caption.clear'}
  | {at: number; do: 'type'; id: string; lines: string[]; x: number; y: number; size?: number}
  | {at: number; do: 'type.clear'}
  | {at: number; do: 'map.focus'; lon: number; lat: number; zoom: number; seconds?: number}
  | {at: number; do: 'map.place'; id: string; kind?: 'object' | 'region' | 'argued' | 'person' | 'wreck' | 'plain'; label?: string; side?: 'right' | 'left' | 'above' | 'below'}
  | {at: number; do: 'map.route'; id: string; from: string; to: string; flow: 'object' | 'material' | 'skill' | 'route'; label?: string; seconds?: number; bend?: number}
  | {at: number; do: 'map.people'; id: string; from: string; to: string; label: string}
  | {at: number; do: 'map.peopleMark'; id: string; label: string; side?: 'right' | 'left' | 'above' | 'below'}
  | {at: number; do: 'map.light'; id: string}
  | {at: number; do: 'map.stamp'; text: string}
  | {at: number; do: 'map.dim'; opacity: number}
  | {at: number; do: 'map.clear'}
  | {at: number; do: 'timeline.scrub'; year: number}
  | {at: number; do: 'timeline.span'; id: string; from: number; to: number; label: string; fuzzyStart?: boolean; fuzzyEnd?: boolean; lane?: number; kind?: 'object' | 'material' | 'skill' | 'people' | 'route' | 'base'}
  | {at: number; do: 'timeline.mark'; id: string; year: number; label: string; argued?: boolean; lane?: number}
  | {at: number; do: 'timeline.band'; band: string; on?: boolean}
  | {at: number; do: 'timeline.light'; id: string}
  | {at: number; do: 'timeline.clear'}
  | {at: number; do: 'object'; title: string; holder: string; accession: string; date: string; licence: string; maker?: string; note?: string}
  | {at: number; do: 'object.clear'}
  | {at: number; do: 'chain'; links: {id: string; label: string; sub?: string; flow?: 'object' | 'material' | 'skill' | 'people' | 'route'; x?: number; y?: number}[]; arrows: {from: string; to: string; flow: 'object' | 'material' | 'skill' | 'people' | 'route'; label?: string}[]; x?: number; y?: number; boxWidth?: number; boxHeight?: number; gap?: number}
  | {at: number; do: 'chain.clear'}
  | {at: number; do: 'legend'; keys: ('object' | 'material' | 'skill' | 'people' | 'route' | 'argued' | 'region')[]}
  | {at: number; do: 'predict'; question: string; options: PredictOption[]; answer: number; pause: number; reveal: {text: string; claim: string; confidence?: string}}
  | {at: number; do: 'hull'}
  | {at: number; do: 'hull.clear'};

export interface PredictOption {
  label: string;
  /** Tap target on the map ... */
  place?: string;
  /** ... or on the timeline ... */
  band?: string;
  /** ... or at a free screen position (for options that are not places). */
  x?: number;
  y?: number;
}
