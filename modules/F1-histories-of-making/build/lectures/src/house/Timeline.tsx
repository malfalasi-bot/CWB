import {Gradient, Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {
  Color,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  tween,
} from '@motion-canvas/core';
import {BANDS, bandByCode, yearLabel, yearToUnit} from './bands';
import {theme} from './theme';

export interface TimelineProps extends NodeProps {
  width?: number;
  height?: number;
}

export interface SpanSpec {
  id: string;
  from: number;
  to: number;
  label: string;
  fuzzyStart?: boolean;
  fuzzyEnd?: boolean;
  lane?: number; // 0 = nearest the strip
  kind?: 'object' | 'material' | 'skill' | 'people' | 'route' | 'base';
}

export interface MarkSpec {
  id: string;
  year: number;
  label: string;
  argued?: boolean;
  lane?: number;
}

const laneColor: Record<string, string> = {
  object: theme.accent,
  material: theme.accent,
  skill: theme.skill,
  people: theme.highlight,
  route: theme.baseDim,
  base: theme.base,
};

/**
 * The Time lens as a strip: the eleven bands B01–B11 at equal width, a scrub
 * marker with the current date, labelled spans whose uncertain ends fade out,
 * and dated marks (an "argued" mark is drawn hollow, in the highlight colour).
 */
export class Timeline extends Node {
  public readonly stripWidth: number;
  public readonly stripHeight: number;
  public readonly year = createSignal(1350);
  private readonly spans = new Map<string, Node>();
  private readonly marks = new Map<string, Node>();
  private readonly bandRects = new Map<string, Rect>();
  private readonly scrub = createRef<Node>();
  private readonly scrubLabel = createRef<Txt>();
  private readonly spanLayer = createRef<Node>();
  private readonly markLayer = createRef<Node>();

  public constructor(props: TimelineProps) {
    super(props);
    this.stripWidth = props.width ?? 1720;
    this.stripHeight = props.height ?? 36;
    const w = this.stripWidth;
    const h = this.stripHeight;
    const n = BANDS.length;
    const bw = w / n;

    // Band cells
    for (let i = 0; i < n; i++) {
      const b = BANDS[i];
      const rect = (
        <Rect
          x={-w / 2 + bw * i + bw / 2}
          y={0}
          width={bw - 2}
          height={h}
          fill={i % 2 === 0 ? '#1a1e25' : '#1f242c'}
          stroke={theme.panelLine}
          lineWidth={1}
          radius={3}
        />
      ) as Rect;
      this.bandRects.set(b.code, rect);
      this.add(rect);
      this.add(
        <Txt
          x={-w / 2 + bw * i + bw / 2}
          y={0}
          text={b.code}
          fontFamily={theme.mono}
          fontSize={14}
          fill={theme.baseDim}
          offsetY={-0.1}
        />,
      );
      this.add(
        <Txt
          x={-w / 2 + bw * i + bw / 2}
          y={h / 2 + 16}
          text={b.label}
          fontFamily={theme.font}
          fontSize={14}
          fill={theme.baseDim}
        />,
      );
    }

    this.add(<Node ref={this.spanLayer} />);
    this.add(<Node ref={this.markLayer} />);

    // Scrub marker
    this.add(
      <Node ref={this.scrub} x={() => this.xOf(this.year())}>
        <Line
          points={[
            [0, -h / 2 - 54],
            [0, h / 2 + 6],
          ]}
          stroke={theme.white}
          lineWidth={2}
        />
        <Rect
          y={-h / 2 - 66}
          width={() => Math.max(60, this.scrubLabel().width() + 20)}
          height={26}
          fill={theme.white}
          radius={4}
        />
        <Txt
          ref={this.scrubLabel}
          y={-h / 2 - 66}
          text={() => yearLabel(Math.round(this.year()))}
          fontFamily={theme.mono}
          fontSize={16}
          fill={theme.bg}
        />
      </Node>,
    );
  }

  /** x position (local) of a year on the strip. */
  public xOf(year: number): number {
    return -this.stripWidth / 2 + yearToUnit(year) * this.stripWidth;
  }

  public *scrubTo(year: number, seconds = 1.2) {
    yield* this.year(year, seconds, easeInOutCubic);
  }

  public *highlightBand(code: string, seconds = 0.6, on = true) {
    const rect = this.bandRects.get(code);
    if (!rect) return;
    yield* all(
      rect.stroke(on ? theme.highlight : theme.panelLine, seconds),
      rect.lineWidth(on ? 3 : 1, seconds),
    );
  }

  public *resetBands(seconds = 0.4) {
    yield* all(
      ...[...this.bandRects.values()].map(r =>
        all(r.stroke(theme.panelLine, seconds), r.lineWidth(1, seconds)),
      ),
    );
  }

  /** A labelled span above the strip; fuzzy ends fade to transparent. */
  public *span(spec: SpanSpec, seconds = 1) {
    const lane = spec.lane ?? 0;
    const color = laneColor[spec.kind ?? 'base'];
    const x0 = this.xOf(spec.from);
    const x1 = this.xOf(spec.to);
    const width = Math.max(6, x1 - x0);
    const y = -this.stripHeight / 2 - 28 - lane * 30;
    const c = new Color(color);
    const transparent = c.alpha(0).serialize();
    const solid = c.alpha(0.85).serialize();
    const stops = [
      {offset: 0, color: spec.fuzzyStart ? transparent : solid},
      {offset: spec.fuzzyStart ? 0.35 : 0.001, color: solid},
      {offset: spec.fuzzyEnd ? 0.65 : 0.999, color: solid},
      {offset: 1, color: spec.fuzzyEnd ? transparent : solid},
    ];
    const fill = new Gradient({
      type: 'linear',
      from: [-width / 2, 0],
      to: [width / 2, 0],
      stops,
    });
    const bar = createRef<Rect>();
    const node = (
      <Node x={x0 + width / 2} y={y} opacity={0}>
        <Rect ref={bar} width={0} height={10} fill={fill} radius={2} />
        <Txt
          y={-16}
          text={spec.label}
          fontFamily={theme.font}
          fontSize={15}
          fill={theme.base}
        />
      </Node>
    ) as Node;
    this.spans.get(spec.id)?.remove();
    this.spans.set(spec.id, node);
    this.spanLayer().add(node);
    yield* all(node.opacity(1, seconds * 0.5), bar().width(width, seconds, easeOutCubic));
  }

  /** A dated mark: a tick and a label. Argued marks are hollow and amber. */
  public *mark(spec: MarkSpec, seconds = 0.6) {
    const lane = spec.lane ?? 0;
    const x = this.xOf(spec.year);
    const y = -this.stripHeight / 2 - 28 - lane * 30;
    const color = spec.argued ? theme.highlight : theme.white;
    const node = (
      <Node x={x} y={y} opacity={0}>
        <Rect
          width={10}
          height={10}
          rotation={45}
          fill={spec.argued ? theme.bg : color}
          stroke={color}
          lineWidth={2}
        />
        <Txt
          y={-16}
          text={spec.argued ? `${spec.label} · argued` : spec.label}
          fontFamily={theme.font}
          fontSize={15}
          fill={spec.argued ? theme.highlight : theme.base}
        />
      </Node>
    ) as Node;
    this.marks.get(spec.id)?.remove();
    this.marks.set(spec.id, node);
    this.markLayer().add(node);
    yield* node.opacity(1, seconds);
  }

  /** Light one span or mark (for a reveal or a closing answer). */
  public *light(id: string, seconds = 0.5) {
    const node = this.spans.get(id) ?? this.marks.get(id);
    if (!node) return;
    yield* tween(seconds, v => node.scale(1 + 0.25 * Math.sin(v * Math.PI)));
  }

  public *clear(seconds = 0.5) {
    const nodes = [...this.spans.values(), ...this.marks.values()];
    yield* all(...nodes.map(n => n.opacity(0, seconds)));
    for (const n of nodes) n.remove();
    this.spans.clear();
    this.marks.clear();
    yield* this.resetBands(0.2);
  }

  public bandCenterX(code: string): number {
    const b = bandByCode(code);
    const i = BANDS.indexOf(b);
    const bw = this.stripWidth / BANDS.length;
    return -this.stripWidth / 2 + bw * i + bw / 2;
  }
}

