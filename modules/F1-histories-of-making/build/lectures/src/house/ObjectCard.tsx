import {Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {theme} from './theme';

export interface ObjectSpec {
  title: string;
  holder: string;
  accession: string;
  date: string;
  licence: string;
  maker?: string;
  note?: string;
}

/**
 * The Object lens as a record card: holder, accession, date range and licence
 * as type, with an image slot left open for the CC0 file (not fetched in this
 * build). Makers are named by role, or the gap in the record is named.
 */
export class ObjectCard extends Node {
  private readonly card = createRef<Rect>();
  private readonly title = createRef<Txt>();
  private readonly meta = createRef<Txt>();
  private readonly maker = createRef<Txt>();
  private readonly note = createRef<Txt>();

  public constructor(props: NodeProps) {
    super(props);
    this.add(
      <Rect
        ref={this.card}
        width={420}
        fill={theme.panel}
        stroke={theme.panelLine}
        lineWidth={1}
        radius={8}
        layout
        direction="column"
        padding={18}
        gap={10}
        opacity={0}
        offsetX={-1}
        offsetY={-1}
      >
        <Rect width={384} height={200} fill={theme.bg} stroke={theme.panelLine} lineWidth={1} radius={6} layout justifyContent="center" alignItems="center">
          <Txt text={'image slot · CC0 file not fetched in this build'} fontFamily={theme.mono} fontSize={13} fill={theme.baseDim} />
        </Rect>
        <Txt ref={this.title} text={''} fontFamily={theme.font} fontSize={22} fill={theme.white} textWrap width={384} />
        <Txt ref={this.meta} text={''} fontFamily={theme.mono} fontSize={14} lineHeight={22} fill={theme.base} textWrap width={384} />
        <Txt ref={this.maker} text={''} fontFamily={theme.font} fontSize={15} lineHeight={22} fill={theme.base} textWrap width={384} />
        <Txt ref={this.note} text={''} fontFamily={theme.font} fontSize={14} lineHeight={20} fill={theme.highlight} textWrap width={384} />
      </Rect>,
    );
  }

  public *show(spec: ObjectSpec, seconds = 0.5) {
    if (this.card().opacity() > 0) yield* this.card().opacity(0, 0.25);
    this.title().text(spec.title);
    this.meta().text(`${spec.holder} ${spec.accession}\n${spec.date}\n${spec.licence}`);
    this.maker().text(spec.maker ?? '');
    this.note().text(spec.note ?? '');
    yield* this.card().opacity(1, seconds);
  }

  public *hide(seconds = 0.4) {
    yield* this.card().opacity(0, seconds);
  }
}

