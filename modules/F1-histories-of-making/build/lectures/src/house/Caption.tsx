import {Layout, Node, NodeProps, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef} from '@motion-canvas/core';
import {confidenceWord, theme} from './theme';

export interface CaptionProps extends NodeProps {
  width?: number;
}

export interface CaptionSpec {
  text: string;
  /** Claim ids from the spec's claims sheet, e.g. "2" or "2, 3". */
  claim?: string;
  /** documented | probable | contested | interpretive | not recorded */
  confidence?: string;
}

/**
 * The narrator's caption: a lower-third panel with the line being said, the
 * claim id in brackets and the confidence word. Also draws content notes
 * (a wider card that begins "Content note:" and keeps its skip line) and
 * free type for lists the lecture refuses to draw as diagrams.
 */
export class Caption extends Node {
  private readonly panel = createRef<Rect>();
  private readonly body = createRef<Txt>();
  private readonly tag = createRef<Txt>();
  private readonly note = createRef<Rect>();
  private readonly noteText = createRef<Txt>();
  private readonly typeLayer = createRef<Node>();
  private readonly width: number;

  public constructor(props: CaptionProps) {
    super(props);
    this.width = props.width ?? 1100;
    this.add(
      <Rect
        ref={this.panel}
        width={this.width}
        fill={theme.panel}
        stroke={theme.panelLine}
        lineWidth={1}
        radius={8}
        padding={[18, 26]}
        layout
        direction="column"
        gap={8}
        opacity={0}
        offsetY={1}
      >
        <Txt
          ref={this.body}
          text={''}
          fontFamily={theme.font}
          fontSize={theme.size.body}
          lineHeight={36}
          fill={theme.white}
          textWrap
          width={this.width - 52}
        />
        <Txt
          ref={this.tag}
          text={''}
          fontFamily={theme.mono}
          fontSize={theme.size.tiny}
          fill={theme.base}
        />
      </Rect>,
    );
    this.add(
      <Rect
        ref={this.note}
        y={-320}
        width={1000}
        fill={theme.panel}
        stroke={theme.highlight}
        lineWidth={2}
        radius={10}
        padding={[26, 34]}
        layout
        opacity={0}
      >
        <Txt
          ref={this.noteText}
          text={''}
          fontFamily={theme.font}
          fontSize={theme.size.h2}
          lineHeight={42}
          fill={theme.white}
          textWrap
          width={1000 - 68}
        />
      </Rect>,
    );
    this.add(<Node ref={this.typeLayer} />);
  }

  public *say(spec: CaptionSpec, seconds = 0.35) {
    if (this.panel().opacity() > 0) {
      yield* this.panel().opacity(0, seconds * 0.6);
    }
    this.body().text(spec.text);
    const parts: string[] = [];
    if (spec.claim) parts.push(`claim ${spec.claim}`);
    if (spec.confidence) parts.push(confidenceWord[spec.confidence] ?? spec.confidence);
    this.tag().text(parts.join(' · '));
    yield* this.panel().opacity(1, seconds);
  }

  public *clear(seconds = 0.35) {
    yield* this.panel().opacity(0, seconds);
  }

  /** A content note, as learners see it. Stays until `noteClear`. */
  public *contentNote(text: string, seconds = 0.5) {
    this.noteText().text(text);
    yield* this.note().opacity(1, seconds);
  }

  public *noteClear(seconds = 0.5) {
    yield* this.note().opacity(0, seconds);
  }

  /** Free type at a screen position: lists and counts the lecture gives in words. */
  public *type(id: string, lines: string[], x: number, y: number, size = theme.size.body, color = theme.white, seconds = 0.6) {
    const node = (
      <Layout x={x} y={y} layout direction="column" gap={10} opacity={0} offsetX={-1} offsetY={-1}>
        {lines.map(l => (
          <Txt
            text={l}
            fontFamily={theme.font}
            fontSize={size}
            fill={l.startsWith('·') ? theme.base : color}
            textWrap
            width={720}
          />
        ))}
      </Layout>
    ) as Layout;
    const prev = this.typeLayer().children().find(c => (c as any).__typeId === id);
    prev?.remove();
    (node as any).__typeId = id;
    this.typeLayer().add(node);
    yield* node.opacity(1, seconds);
  }

  public *typeClear(seconds = 0.4) {
    const kids = this.typeLayer().children();
    if (!kids.length) return;
    yield* all(...kids.map(k => k.opacity(0, seconds)));
    for (const k of kids) k.remove();
  }
}
