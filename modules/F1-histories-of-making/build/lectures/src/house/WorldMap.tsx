import {Circle, Node, NodeProps, Path, Rect, Txt} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  tween,
} from '@motion-canvas/core';
import {feature} from 'topojson-client';
import landTopo from 'world-atlas/land-110m.json';
import {FlowKind, flowStyle, theme} from './theme';

export interface Place {
  id: string;
  name: string;
  lat: number | null;
  lon: number | null;
  /** Where the coordinate came from, or "placed by region" with the anchor. */
  source: string;
  region?: string;
}

export type PlaceKind = 'object' | 'region' | 'argued' | 'person' | 'wreck' | 'plain';

export interface WorldMapProps extends NodeProps {
  width?: number;
  height?: number;
  places: Place[];
}

interface Projected {
  x: number;
  y: number;
}

/**
 * The Place lens: an equirectangular world drawn as land outlines only (no
 * borders of any date), places as dots from lat/lon, routes as arcs that draw
 * themselves, a people layer with its own mark, a legend hook and a date stamp.
 *
 * The world is drawn three times (−360°, 0°, +360°) so the camera can centre
 * on the Pacific and arcs can cross the antimeridian.
 */
export class WorldMap extends Node {
  public readonly viewWidth: number;
  public readonly viewHeight: number;
  /** Pixels per degree at zoom 1. */
  public readonly k: number;
  public readonly zoom = createSignal(1);
  public readonly centerLon = createSignal(20);
  public readonly centerLat = createSignal(20);
  private readonly world = createRef<Node>();
  private readonly routeLayer = createRef<Node>();
  private readonly placeLayer = createRef<Node>();
  private readonly peopleLayer = createRef<Node>();
  private readonly stampText = createRef<Txt>();
  private readonly dimmer = createRef<Rect>();
  private readonly places = new Map<string, Place>();
  private readonly placeNodes = new Map<string, Node>();
  private readonly routeNodes = new Map<string, Node>();
  private readonly peopleNodes = new Map<string, Node>();

  public constructor(props: WorldMapProps) {
    super(props);
    this.viewWidth = props.width ?? 1920;
    this.viewHeight = props.height ?? 900;
    this.k = this.viewWidth / 360;
    for (const p of props.places) this.places.set(p.id, p);

    // Clip to the viewport
    const clip = (
      <Rect
        width={this.viewWidth}
        height={this.viewHeight}
        clip
        fill={theme.sea}
      />
    ) as Rect;
    this.add(clip);

    const world = (
      <Node
        ref={this.world}
        scale={() => this.zoom()}
        position={() => {
          const p = this.project(this.centerLon(), this.centerLat());
          return new Vector2(-p.x * this.zoom(), -p.y * this.zoom());
        }}
      />
    ) as Node;
    clip.add(world);

    // Land outlines, three copies
    const land = feature(landTopo as any, (landTopo as any).objects.land) as any;
    const geom = land.features ? land.features[0].geometry : land.geometry;
    for (const offset of [-360, 0, 360]) {
      const paths: string[] = [];
      for (const poly of geom.coordinates as number[][][][]) {
        for (const ring of poly) {
          let d = '';
          ring.forEach((pt, i) => {
            const p = this.project(pt[0] + offset, pt[1]);
            d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          });
          d += 'Z';
          paths.push(d);
        }
      }
      world.add(
        <Path
          data={paths.join(' ')}
          fill={theme.land}
          stroke={theme.landLine}
          lineWidth={() => 1 / this.zoom()}
        />,
      );
    }

    world.add(<Node ref={this.routeLayer} />);
    world.add(<Node ref={this.peopleLayer} />);
    world.add(<Node ref={this.placeLayer} />);

    // Dimmer for text-only stations (the Atlantic)
    this.add(
      <Rect
        ref={this.dimmer}
        width={this.viewWidth}
        height={this.viewHeight}
        fill={theme.bg}
        opacity={0}
      />,
    );

    // Date stamp, top right of the map
    this.add(
      <Node x={this.viewWidth / 2 - 30} y={-this.viewHeight / 2 + 30}>
        <Txt
          ref={this.stampText}
          text={''}
          fontFamily={theme.mono}
          fontSize={22}
          fill={theme.white}
          offsetX={1}
          offsetY={-1}
        />
      </Node>,
    );
  }

  /** Equirectangular projection, centred on 0,0 in world space. */
  public project(lon: number, lat: number): Projected {
    return {x: lon * this.k, y: -lat * this.k};
  }

  /** Unwrap a longitude so it lies within 180° of a reference. */
  private unwrap(lon: number, ref: number): number {
    return lon + 360 * Math.round((ref - lon) / 360);
  }

  public resolve(id: string): Place {
    const p = this.places.get(id);
    if (!p) throw new Error(`Unknown place "${id}"`);
    if (p.lat === null || p.lon === null) {
      throw new Error(`Place "${id}" has no coordinate; place it by region first`);
    }
    return p;
  }

  public *focus(lon: number, lat: number, zoom: number, seconds = 1.6) {
    const from = this.centerLon();
    const target = this.unwrap(lon, from);
    yield* all(
      this.centerLon(target, seconds, easeInOutCubic),
      this.centerLat(lat, seconds, easeInOutCubic),
      this.zoom(zoom, seconds, easeInOutCubic),
    );
  }

  public *stamp(text: string, seconds = 0.4) {
    yield* this.stampText().opacity(0, seconds / 2);
    this.stampText().text(text);
    yield* this.stampText().opacity(1, seconds / 2);
  }

  public *dim(opacity: number, seconds = 0.8) {
    yield* this.dimmer().opacity(opacity, seconds);
  }

  private inv() {
    return 1 / this.zoom();
  }

  /** A place dot with a label. `argued` draws a hollow amber mark; `person` an amber ring. */
  public *place(
    id: string,
    kind: PlaceKind = 'object',
    label?: string,
    seconds = 0.6,
    labelSide: 'right' | 'left' | 'above' | 'below' = 'right',
  ) {
    const p = this.resolve(id);
    const lon = this.unwrap(p.lon!, this.centerLon());
    const pos = this.project(lon, p.lat!);
    const text = label ?? p.name;
    const byRegion = p.source.startsWith('placed by region');
    const color =
      kind === 'argued' || kind === 'person' ? theme.highlight : kind === 'region' ? theme.baseDim : theme.white;
    const r = kind === 'region' ? 7 : 6;
    const lx = labelSide === 'right' ? 12 : labelSide === 'left' ? -12 : 0;
    const ly = labelSide === 'above' ? -14 : labelSide === 'below' ? 14 : 0;
    const ox = labelSide === 'right' ? -1 : labelSide === 'left' ? 1 : 0;
    const oy = labelSide === 'above' ? 1 : labelSide === 'below' ? -1 : 0;
    const node = (
      <Node x={pos.x} y={pos.y} scale={() => this.inv()} opacity={0}>
        {kind === 'person' ? (
          <Circle width={r * 2 + 6} height={r * 2 + 6} stroke={color} lineWidth={2.5} fill={theme.bg} />
        ) : kind === 'argued' ? (
          <Rect width={r * 2} height={r * 2} rotation={45} stroke={color} lineWidth={2.5} fill={theme.bg} />
        ) : kind === 'wreck' ? (
          <Rect width={r * 2} height={r * 2} rotation={45} fill={theme.baseDim} />
        ) : kind === 'region' ? (
          <Circle width={r * 2} height={r * 2} stroke={color} lineWidth={2} lineDash={[3, 3]} fill={theme.bg} />
        ) : (
          <Circle width={r * 2} height={r * 2} fill={color} />
        )}
        <Txt
          x={lx}
          y={ly}
          offsetX={ox}
          offsetY={oy}
          text={byRegion ? `${text} · placed by region` : text}
          fontFamily={theme.font}
          fontSize={kind === 'region' ? 15 : 17}
          fill={kind === 'argued' || kind === 'person' ? theme.highlight : theme.base}
          shadowColor={theme.bg}
          shadowBlur={6}
        />
      </Node>
    ) as Node;
    const key = `${id}#${kind}`;
    this.placeNodes.get(key)?.remove();
    this.placeNodes.set(key, node);
    this.placeLayer().add(node);
    yield* node.opacity(1, seconds);
  }

  /** Light a dot (reveal or answer): pulse in the highlight colour. */
  public *light(id: string, seconds = 0.8) {
    const node =
      this.placeNodes.get(`${id}#object`) ??
      this.placeNodes.get(`${id}#plain`) ??
      this.placeNodes.get(`${id}#person`) ??
      this.placeNodes.get(`${id}#argued`) ??
      this.placeNodes.get(`${id}#region`);
    if (!node) return;
    const ring = (
      <Circle width={10} height={10} stroke={theme.highlight} lineWidth={3} opacity={1} />
    ) as Circle;
    node.add(ring);
    yield* all(ring.width(70, seconds, easeOutCubic), ring.height(70, seconds, easeOutCubic), ring.opacity(0, seconds));
    ring.remove();
  }

  /** The arc path data between two places, curved to one side of the chord. */
  private arcData(fromId: string, toId: string, bend = 0.18): {d: string; mid: Projected} {
    const a = this.resolve(fromId);
    const b = this.resolve(toId);
    const lonA = this.unwrap(a.lon!, this.centerLon());
    const lonB = this.unwrap(b.lon!, lonA);
    const p0 = this.project(lonA, a.lat!);
    const p1 = this.project(lonB, b.lat!);
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    // Perpendicular, biased northwards (negative y) so arcs lift off the chord.
    let nx = -dy / len;
    let ny = dx / len;
    if (ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    const cx = (p0.x + p1.x) / 2 + nx * len * bend;
    const cy = (p0.y + p1.y) / 2 + ny * len * bend;
    return {d: `M${p0.x} ${p0.y} Q${cx} ${cy} ${p1.x} ${p1.y}`, mid: {x: (p0.x + 2 * cx + p1.x) / 4, y: (p0.y + 2 * cy + p1.y) / 4}};
  }

  /**
   * A route arc for an object, material, skill or route flow. People never
   * use this method; see `peopleTie`.
   */
  public *route(
    id: string,
    fromId: string,
    toId: string,
    flow: Exclude<FlowKind, 'people'>,
    label?: string,
    seconds = 1.4,
    bend = 0.18,
  ) {
    const style = flowStyle[flow];
    const {d, mid} = this.arcData(fromId, toId, bend);
    const path = createRef<Path>();
    const node = (
      <Node>
        <Path
          ref={path}
          data={d}
          stroke={style.stroke}
          lineWidth={() => (flow === 'route' ? 2.5 : 3) * this.inv()}
          lineDash={() => style.dash.map(v => v * this.inv())}
          lineCap="round"
          end={0}
          endArrow={flow !== 'route'}
          arrowSize={() => 14 * this.inv()}
        />
        {label ? (
          <Txt
            x={mid.x}
            y={mid.y}
            scale={() => this.inv()}
            text={label}
            fontFamily={theme.font}
            fontSize={15}
            fill={flow === 'skill' || flow === 'route' ? theme.base : theme.accent}
            shadowColor={theme.bg}
            shadowBlur={6}
            offsetY={1}
            opacity={0}
          />
        ) : null}
      </Node>
    ) as Node;
    this.routeNodes.get(id)?.remove();
    this.routeNodes.set(id, node);
    this.routeLayer().add(node);
    yield* path().end(1, seconds, easeInOutCubic);
    const txt = node.children()[1] as Txt | undefined;
    if (txt) yield* txt.opacity(1, 0.4);
  }

  /**
   * The people layer: an amber ring at each place and a dotted amber tie,
   * drawn apart from the goods arcs (bent the other way), with the words the
   * record gives. Never an arrow.
   */
  public *peopleTie(id: string, fromId: string, toId: string, label: string, seconds = 1.4) {
    const style = flowStyle.people;
    const {d, mid} = this.arcData(fromId, toId, -0.14);
    const path = createRef<Path>();
    const node = (
      <Node>
        <Path
          ref={path}
          data={d}
          stroke={style.stroke}
          lineWidth={() => 2.5 * this.inv()}
          lineDash={() => style.dash.map(v => v * this.inv())}
          lineCap="round"
          end={0}
        />
        <Txt
          x={mid.x}
          y={mid.y}
          scale={() => this.inv()}
          text={label}
          fontFamily={theme.font}
          fontSize={15}
          fill={theme.highlight}
          shadowColor={theme.bg}
          shadowBlur={6}
          offsetY={-1}
          opacity={0}
        />
      </Node>
    ) as Node;
    this.peopleNodes.get(id)?.remove();
    this.peopleNodes.set(id, node);
    this.peopleLayer().add(node);
    yield* all(this.place(fromId, 'person', undefined, 0.4), this.place(toId, 'person', undefined, 0.4));
    yield* path().end(1, seconds, easeInOutCubic);
    yield* (node.children()[1] as Txt).opacity(1, 0.4);
  }

  /** A people mark with words only, no tie (the Periplus, the Sahara). */
  public *peopleMark(id: string, label: string, seconds = 0.6, labelSide: 'right' | 'left' | 'above' | 'below' = 'right') {
    yield* this.place(id, 'person', label, seconds, labelSide);
  }

  public *light_route(id: string, seconds = 0.8) {
    const node = this.routeNodes.get(id);
    if (!node) return;
    const path = node.children()[0] as Path;
    const prev = path.stroke();
    yield* tween(seconds, v => {
      path.lineWidth(((3 + 4 * Math.sin(v * Math.PI)) as number) * this.inv());
    });
    path.stroke(prev);
  }

  public *clear(seconds = 0.6) {
    const nodes = [...this.placeNodes.values(), ...this.routeNodes.values(), ...this.peopleNodes.values()];
    yield* all(...nodes.map(n => n.opacity(0, seconds)));
    for (const n of nodes) n.remove();
    this.placeNodes.clear();
    this.routeNodes.clear();
    this.peopleNodes.clear();
  }

  /** Screen-space position of a place (for overlays such as prediction taps). */
  public screenPosition(id: string): Vector2 {
    const p = this.resolve(id);
    const lon = this.unwrap(p.lon!, this.centerLon());
    const pr = this.project(lon, p.lat!);
    const c = this.project(this.centerLon(), this.centerLat());
    return new Vector2((pr.x - c.x) * this.zoom(), (pr.y - c.y) * this.zoom());
  }
}
