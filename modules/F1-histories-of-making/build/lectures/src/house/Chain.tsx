import {Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {all, easeOutCubic, sequence} from '@motion-canvas/core';
import {FlowKind, flowStyle, theme} from './theme';

export interface ChainLink {
  id: string;
  label: string;
  sub?: string;
  /** Box border colour follows the flow it carries. */
  flow?: FlowKind;
  x?: number;
  y?: number;
}

export interface ChainArrow {
  from: string;
  to: string;
  flow: FlowKind;
  label?: string;
}

export interface ChainSpec {
  links: ChainLink[];
  arrows: ChainArrow[];
  /** Horizontal row layout when links carry no x/y. */
  gap?: number;
  boxWidth?: number;
  boxHeight?: number;
}

/**
 * The Chain lens: links of a supply chain (or a skill chain) as boxes with
 * arrows between them. A people arrow is dotted amber and carries no arrowhead,
 * so people are never drawn with the goods' arrow (H9).
 */
export class Chain extends Node {
  private readonly boxes = new Map<string, Rect>();
  private readonly items: Node[] = [];

  public constructor(props: NodeProps) {
    super(props);
  }

  public *build(spec: ChainSpec, seconds = 1.2) {
    yield* this.clear(0.2);
    const bw = spec.boxWidth ?? 250;
    const bh = spec.boxHeight ?? 86;
    const gap = spec.gap ?? 70;
    const n = spec.links.length;
    const totalW = n * bw + (n - 1) * gap;
    spec.links.forEach((link, i) => {
      const x = link.x ?? -totalW / 2 + bw / 2 + i * (bw + gap);
      const y = link.y ?? 0;
      const stroke = link.flow ? flowStyle[link.flow].stroke : theme.base;
      const box = (
        <Rect
          x={x}
          y={y}
          width={bw}
          height={bh}
          fill={theme.panel}
          stroke={stroke}
          lineWidth={2}
          radius={6}
          opacity={0}
        >
          <Txt
            y={link.sub ? -14 : 0}
            text={link.label}
            fontFamily={theme.font}
            fontSize={22}
            fill={theme.white}
            textAlign="center"
          />
          {link.sub ? (
            <Txt
              y={16}
              text={link.sub}
              fontFamily={theme.font}
              fontSize={15}
              fill={theme.base}
              textAlign="center"
            />
          ) : null}
        </Rect>
      ) as Rect;
      this.boxes.set(link.id, box);
      this.items.push(box);
      this.add(box);
    });

    const arrows: Line[] = [];
    for (const a of spec.arrows) {
      const from = this.boxes.get(a.from);
      const to = this.boxes.get(a.to);
      if (!from || !to) continue;
      const style = flowStyle[a.flow];
      const p0 = from.position();
      const p1 = to.position();
      // Leave the boxes' edges
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const start = [p0.x + ux * (Math.abs(ux) > Math.abs(uy) ? bw / 2 : bh / 2), p0.y + uy * (Math.abs(ux) > Math.abs(uy) ? bw / 2 : bh / 2)];
      const end = [p1.x - ux * (Math.abs(ux) > Math.abs(uy) ? bw / 2 : bh / 2), p1.y - uy * (Math.abs(ux) > Math.abs(uy) ? bw / 2 : bh / 2)];
      const line = (
        <Line
          points={[start as [number, number], end as [number, number]]}
          stroke={style.stroke}
          lineWidth={3}
          lineDash={[...style.dash]}
          lineCap="round"
          endArrow={a.flow !== 'people'}
          arrowSize={12}
          end={0}
        />
      ) as Line;
      this.items.push(line);
      this.add(line);
      arrows.push(line);
      if (a.label) {
        const t = (
          <Txt
            x={(start[0] + end[0]) / 2}
            y={(start[1] + end[1]) / 2 - 18}
            text={a.label}
            fontFamily={theme.font}
            fontSize={15}
            fill={a.flow === 'people' ? theme.highlight : theme.base}
            opacity={0}
          />
        ) as Txt;
        this.items.push(t);
        this.add(t);
        arrows.push(t as unknown as Line);
      }
    }

    yield* sequence(0.15, ...[...this.boxes.values()].map(b => b.opacity(1, 0.4)));
    yield* all(
      ...arrows.map(a => (a instanceof Line ? a.end(1, seconds * 0.6, easeOutCubic) : a.opacity(1, 0.4))),
    );
  }

  public *clear(seconds = 0.4) {
    if (!this.items.length) return;
    yield* all(...this.items.map(n => n.opacity(0, seconds)));
    for (const n of this.items) n.remove();
    this.items.length = 0;
    this.boxes.clear();
  }

  public box(id: string): Rect | undefined {
    return this.boxes.get(id);
  }
}

