import {Circle, Line, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {all, sequence} from '@motion-canvas/core';
import {FlowKind, flowStyle, theme} from './theme';

export interface LegendProps extends NodeProps {}

type LegendKey = FlowKind | 'argued' | 'region';

/**
 * One legend for every lecture: the four flows with their line styles, the
 * "argued" mark and the "placed by region" dot. Rows show and hide by key.
 */
export class Legend extends Node {
  private readonly rows = new Map<LegendKey, Node>();

  public constructor(props: LegendProps) {
    super(props);
    const keys: LegendKey[] = ['object', 'material', 'skill', 'people', 'argued', 'region'];
    const panel = (
      <Rect fill={theme.panel} stroke={theme.panelLine} lineWidth={1} radius={8} width={300} height={24 + keys.length * 30} offsetX={-1} offsetY={-1} />
    ) as Rect;
    this.add(panel);
    keys.forEach((key, i) => {
      const y = 24 + i * 30;
      let glyph: Node;
      let label: string;
      if (key === 'argued') {
        glyph = <Rect x={28} y={y} width={11} height={11} rotation={45} stroke={theme.highlight} lineWidth={2} fill={theme.bg} />;
        label = 'Argued: two readings, both shown';
      } else if (key === 'region') {
        glyph = <Circle x={28} y={y} width={12} height={12} stroke={theme.baseDim} lineWidth={2} lineDash={[3, 3]} />;
        label = 'Placed by region (no coordinate in the claims)';
      } else if (key === 'people') {
        glyph = (
          <Node>
            <Circle x={16} y={y} width={12} height={12} stroke={theme.highlight} lineWidth={2} />
            <Line points={[[22, y], [40, y]]} stroke={theme.highlight} lineWidth={2.5} lineDash={[3, 6]} />
          </Node>
        );
        label = flowStyle.people.label;
      } else {
        const s = flowStyle[key];
        glyph = <Line points={[[14, y], [42, y]]} stroke={s.stroke} lineWidth={3} lineDash={[...s.dash]} lineCap="round" endArrow arrowSize={8} />;
        label = s.label;
      }
      const row = (
        <Node opacity={0}>
          {glyph}
          <Txt x={54} y={y} offsetX={-1} text={label} fontFamily={theme.font} fontSize={15} fill={theme.base} />
        </Node>
      ) as Node;
      this.rows.set(key, row);
      this.add(row);
    });
  }

  public *show(keys: LegendKey[], seconds = 0.4) {
    const on = keys.map(k => this.rows.get(k)!).filter(Boolean);
    const off = [...this.rows.entries()].filter(([k]) => !keys.includes(k)).map(([, n]) => n);
    yield* all(...off.map(n => n.opacity(0, seconds)));
    yield* sequence(0.08, ...on.map(n => n.opacity(1, seconds)));
  }
}
