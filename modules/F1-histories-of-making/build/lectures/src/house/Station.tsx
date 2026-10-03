import {Circle, Node, Rect, Txt, View2D} from '@motion-canvas/2d';
import {
  ThreadGenerator,
  Vector2,
  all,
  createRef,
  easeOutCubic,
  sequence,
  spawn,
  waitFor,
} from '@motion-canvas/core';
import {Caption} from './Caption';
import {Chain} from './Chain';
import {Legend} from './Legend';
import {ObjectCard} from './ObjectCard';
import {Timeline} from './Timeline';
import {WorldMap} from './WorldMap';
import {Command, LectureData, PredictOption, QuestionData, StationData} from './lecture';
import {theme} from './theme';

/** Frame geometry: 1920 × 1080. The map takes the top 900 px, the timeline the rest. */
export const FRAME = {w: 1920, h: 1080, mapH: 900};

export interface House {
  view: View2D;
  map: WorldMap;
  timeline: Timeline;
  caption: Caption;
  legend: Legend;
  object: ObjectCard;
  chain: Chain;
  chapter: Txt;
  overlay: Node;
  titleCard: Rect;
  /** Scene-specific drawings (mechanism moments), registered by name. */
  extras: Record<string, () => ThreadGenerator>;
}

/** Build the fixed house layout into a view. */
export function buildHouse(view: View2D, data: LectureData): House {
  view.fill(theme.bg);
  const map = createRef<WorldMap>();
  const timeline = createRef<Timeline>();
  const caption = createRef<Caption>();
  const legend = createRef<Legend>();
  const object = createRef<ObjectCard>();
  const chain = createRef<Chain>();
  const chapter = createRef<Txt>();
  const overlay = createRef<Node>();
  const titleCard = createRef<Rect>();
  const titleText = createRef<Txt>();

  const mapY = -FRAME.h / 2 + FRAME.mapH / 2;
  view.add(<WorldMap ref={map} y={mapY} width={FRAME.w} height={FRAME.mapH} places={data.places} />);
  view.add(<Timeline ref={timeline} y={FRAME.h / 2 - 62} width={1720} height={34} />);
  view.add(<Chain ref={chain} y={mapY - 120} />);
  view.add(<Caption ref={caption} y={mapY + FRAME.mapH / 2 - 24} width={1120} />);
  view.add(<Legend ref={legend} x={FRAME.w / 2 - 330} y={-FRAME.h / 2 + 72} />);
  view.add(<ObjectCard ref={object} x={-FRAME.w / 2 + 30} y={-FRAME.h / 2 + 74} />);
  view.add(
    <Txt
      ref={chapter}
      x={-FRAME.w / 2 + 30}
      y={-FRAME.h / 2 + 30}
      offsetX={-1}
      offsetY={-1}
      text={''}
      fontFamily={theme.font}
      fontSize={theme.size.small}
      fill={theme.base}
    />,
  );
  view.add(<Node ref={overlay} />);
  view.add(
    <Rect ref={titleCard} width={FRAME.w} height={FRAME.h} fill={theme.bg} opacity={1} layout direction="column" justifyContent="center" alignItems="center" gap={18}>
      <Txt text={data.unit} fontFamily={theme.mono} fontSize={theme.size.h2} fill={theme.accent} />
      <Txt ref={titleText} text={data.title} fontFamily={theme.font} fontSize={theme.size.title} fill={theme.white} textAlign="center" textWrap width={1400} />
      <Txt text={data.subtitle ?? ''} fontFamily={theme.font} fontSize={theme.size.h2} fill={theme.base} textAlign="center" textWrap width={1200} />
      <Txt text={'Histories of making · a station tour over one map and one timeline'} fontFamily={theme.font} fontSize={theme.size.small} fill={theme.baseDim} />
    </Rect>,
  );

  return {
    view,
    map: map(),
    timeline: timeline(),
    caption: caption(),
    legend: legend(),
    object: object(),
    chain: chain(),
    chapter: chapter(),
    overlay: overlay(),
    titleCard: titleCard(),
    extras: {},
  };
}

/** Run one command. Commands that must block (predict) are awaited; the rest are spawned. */
export function* runCommand(h: House, cmd: Command): ThreadGenerator {
  switch (cmd.do) {
    case 'chapter':
      h.chapter.text(`${cmd.n} · ${cmd.title}`);
      h.chapter.opacity(0);
      yield* h.chapter.opacity(1, 0.4);
      return;
    case 'note':
      yield* h.caption.contentNote(cmd.text);
      yield* waitFor(cmd.seconds);
      yield* h.caption.noteClear();
      return;
    case 'caption':
      yield* h.caption.say({text: cmd.text, claim: cmd.claim, confidence: cmd.confidence});
      return;
    case 'caption.clear':
      yield* h.caption.clear();
      return;
    case 'type':
      yield* h.caption.type(cmd.id, cmd.lines, cmd.x, cmd.y, cmd.size);
      return;
    case 'type.clear':
      yield* h.caption.typeClear();
      return;
    case 'map.focus':
      yield* h.map.focus(cmd.lon, cmd.lat, cmd.zoom, cmd.seconds ?? 1.6);
      return;
    case 'map.place':
      yield* h.map.place(cmd.id, cmd.kind ?? 'object', cmd.label, 0.6, cmd.side ?? 'right');
      return;
    case 'map.route':
      yield* h.map.route(cmd.id, cmd.from, cmd.to, cmd.flow, cmd.label, cmd.seconds ?? 1.4, cmd.bend ?? 0.18);
      return;
    case 'map.people':
      yield* h.map.peopleTie(cmd.id, cmd.from, cmd.to, cmd.label);
      return;
    case 'map.peopleMark':
      yield* h.map.peopleMark(cmd.id, cmd.label, 0.6, cmd.side ?? 'right');
      return;
    case 'map.light':
      yield* h.map.light(cmd.id);
      return;
    case 'map.stamp':
      yield* h.map.stamp(cmd.text);
      return;
    case 'map.dim':
      yield* h.map.dim(cmd.opacity);
      return;
    case 'map.clear':
      yield* h.map.clear();
      return;
    case 'timeline.scrub':
      yield* h.timeline.scrubTo(cmd.year);
      return;
    case 'timeline.span':
      yield* h.timeline.span(cmd);
      return;
    case 'timeline.mark':
      yield* h.timeline.mark(cmd);
      return;
    case 'timeline.band':
      yield* h.timeline.highlightBand(cmd.band, 0.5, cmd.on ?? true);
      return;
    case 'timeline.light':
      yield* h.timeline.light(cmd.id);
      return;
    case 'timeline.clear':
      yield* h.timeline.clear();
      return;
    case 'object':
      yield* h.object.show(cmd);
      return;
    case 'object.clear':
      yield* h.object.hide();
      return;
    case 'chain':
      h.chain.position(new Vector2(cmd.x ?? 0, cmd.y ?? -FRAME.h / 2 + FRAME.mapH / 2 - 120));
      yield* h.chain.build({links: cmd.links, arrows: cmd.arrows, boxWidth: cmd.boxWidth, boxHeight: cmd.boxHeight, gap: cmd.gap});
      return;
    case 'chain.clear':
      yield* h.chain.clear();
      return;
    case 'legend':
      yield* h.legend.show(cmd.keys);
      return;
    case 'predict':
      yield* runPrediction(h, cmd.question, cmd.options, cmd.answer, cmd.pause, cmd.reveal);
      return;
    case 'hull':
      if (h.extras.hull) yield* h.extras.hull();
      return;
    case 'hull.clear':
      if (h.extras.hullClear) yield* h.extras.hullClear();
      return;
  }
}

/** Screen position of a tap option: on the map or on the timeline. */
function optionPosition(h: House, opt: PredictOption): Vector2 {
  if (opt.place) {
    return h.map.position().add(h.map.screenPosition(opt.place));
  }
  if (opt.band) {
    return new Vector2(h.timeline.bandCenterX(opt.band), h.timeline.position().y - 118);
  }
  return new Vector2(opt.x ?? 0, opt.y ?? 0);
}

/**
 * One-tap prediction: the question in the caption, lettered tap targets on the
 * map or the timeline, a pause (the learner's tap), then the reveal. In the
 * film the pause is a hold; in the page player it is a real tap.
 */
export function* runPrediction(
  h: House,
  question: string,
  options: PredictOption[],
  answer: number,
  pause: number,
  reveal: {text: string; claim: string; confidence?: string},
): ThreadGenerator {
  const letters = ['A', 'B', 'C', 'D'];
  const targets: Node[] = [];
  options.forEach((opt, i) => {
    const pos = optionPosition(h, opt);
    const node = (
      <Node position={pos} opacity={0}>
        <Circle width={44} height={44} fill={theme.panel} stroke={theme.white} lineWidth={2} />
        <Txt text={letters[i]} fontFamily={theme.mono} fontSize={20} fill={theme.white} />
        <Txt x={30} offsetX={-1} text={opt.label} fontFamily={theme.font} fontSize={18} fill={theme.white} shadowColor={theme.bg} shadowBlur={8} />
      </Node>
    ) as Node;
    targets.push(node);
    h.overlay.add(node);
  });
  yield* h.caption.say({text: `One tap · ${question}`});
  yield* sequence(0.12, ...targets.map(t => t.opacity(1, 0.3)));
  yield* waitFor(pause);
  // Reveal
  const win = targets[answer];
  const ring = win.children()[0] as Circle;
  yield* all(
    ring.fill(theme.highlight, 0.3),
    ring.stroke(theme.highlight, 0.3),
    ...targets.filter((_, i) => i !== answer).map(t => t.opacity(0.35, 0.3)),
  );
  yield* h.caption.say({text: reveal.text, claim: reveal.claim, confidence: reveal.confidence});
  spawn(function* () {
    yield* waitFor(3.5);
    yield* all(...targets.map(t => t.opacity(0, 0.4)));
    for (const t of targets) t.remove();
  });
}

/** Run a station: commands in time order; the station is padded to its planned length. */
export function* runStation(h: House, station: StationData): ThreadGenerator {
  const cmds = [...station.commands].sort((a, b) => a.at - b.at);
  let elapsed = 0;
  for (const cmd of cmds) {
    const wait = cmd.at - elapsed;
    if (wait > 0) {
      yield* waitFor(wait);
      elapsed += wait;
    }
    if (cmd.do === 'predict') {
      // Blocking: the pause belongs to the station's clock.
      const before = elapsed;
      yield* runCommand(h, cmd);
      elapsed = before + cmd.pause + 1.4; // approximate time spent in the caption fades
    } else {
      spawn(runCommand(h, cmd));
    }
  }
  const rest = station.seconds - elapsed;
  if (rest > 0) yield* waitFor(rest);
}

/** The closing questions: each one is a prediction whose reveal shows on the map or timeline. */
export function* runClosing(h: House, questions: QuestionData[], seconds: number): ThreadGenerator {
  const per = seconds / questions.length;
  h.chapter.text('Check · eight taps');
  yield* all(h.map.clear(0.4), h.timeline.clear(0.4), h.caption.typeClear(0.3), h.object.hide(0.3), h.chain.clear(0.3));
  yield* h.map.dim(0, 0.3);
  for (const q of questions) {
    // Place the answer's visual first (hidden under the tap), then ask.
    const t0 = 0;
    const setup = q.show.filter(c => c.at <= 0);
    for (const c of setup) spawn(runCommand(h, c));
    const options: PredictOption[] = q.options.map(o => ({label: o}));
    // Lay options in a row under the map's centre.
    const n = options.length;
    const nodes: Node[] = [];
    options.forEach((opt, i) => {
      const x = -((n - 1) * 300) / 2 + i * 300;
      const node = (
        <Node x={x} y={-FRAME.h / 2 + FRAME.mapH - 170} opacity={0}>
          <Rect width={270} height={54} fill={theme.panel} stroke={theme.white} lineWidth={2} radius={8} />
          <Txt text={`${['A', 'B', 'C'][i]}  ${opt.label}`} fontFamily={theme.font} fontSize={20} fill={theme.white} />
        </Node>
      ) as Node;
      nodes.push(node);
      h.overlay.add(node);
    });
    yield* h.caption.say({text: `Tap · ${q.question}`});
    yield* sequence(0.1, ...nodes.map(nd => nd.opacity(1, 0.3)));
    yield* waitFor(Math.max(1.5, per * 0.45));
    const win = nodes[q.answer];
    yield* all(
      (win.children()[0] as Rect).stroke(theme.highlight, 0.3),
      (win.children()[0] as Rect).fill('#3a3023', 0.3),
      ...nodes.filter((_, i) => i !== q.answer).map(nd => nd.opacity(0.35, 0.3)),
    );
    const later = q.show.filter(c => c.at > 0);
    yield* all(...later.map(c => runCommand(h, c)));
    yield* h.caption.say({text: `${q.options[q.answer]}`, claim: q.claim, confidence: 'documented'});
    yield* waitFor(Math.max(1.5, per * 0.4));
    yield* all(...nodes.map(nd => nd.opacity(0, 0.3)));
    for (const nd of nodes) nd.remove();
    yield* all(h.map.clear(0.3), h.timeline.clear(0.3));
    void t0;
  }
  yield* h.caption.clear();
}

/** The whole lecture: title, stations, closing questions. */
export function* runLecture(h: House, data: LectureData): ThreadGenerator {
  // Title card over the house; the timeline and map fade in beneath.
  h.timeline.year(1350);
  yield* waitFor(data.titleSeconds * 0.7);
  yield* h.titleCard.opacity(0, data.titleSeconds * 0.3, easeOutCubic);
  yield* h.legend.show(['object', 'material', 'skill', 'people', 'argued', 'region']);
  for (const station of data.stations) {
    yield* runStation(h, station);
  }
  yield* runClosing(h, data.closing.questions, data.closing.seconds);
  yield* waitFor(1);
}
