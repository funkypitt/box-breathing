// Shapes whose edges are as long as the breathing phases they stand for, so
// the dot moves at one steady pace all the way round. Units are seconds; the
// caller scales the result to pixels.

export type Pt = { x: number; y: number };

export type Edge =
  | { kind: 'line'; from: Pt; to: Pt; length: number }
  | { kind: 'arc'; center: Pt; r: number; start: number; sweep: number; length: number };

export interface Geometry {
  edges: Edge[];
  width: number;
  height: number;
  perimeter: number;
}

export type ShapeKind = 'square' | 'triangle' | 'petal' | 'circle';

function line(from: Pt, to: Pt): Edge {
  return { kind: 'line', from, to, length: Math.hypot(to.x - from.x, to.y - from.y) };
}

function arc(center: Pt, r: number, start: number, sweep: number): Edge {
  return { kind: 'arc', center, r, start, sweep, length: r * Math.abs(sweep) };
}

export function pointAt(edge: Edge, t: number): Pt {
  if (edge.kind === 'line') {
    return {
      x: edge.from.x + (edge.to.x - edge.from.x) * t,
      y: edge.from.y + (edge.to.y - edge.from.y) * t,
    };
  }
  const a = edge.start + edge.sweep * t;
  return { x: edge.center.x + edge.r * Math.cos(a), y: edge.center.y + edge.r * Math.sin(a) };
}

// Half the angle of a circular arc of the given length over the given chord:
// solves sin(x) / x = chord / length by bisection (the ratio falls from 1 to 0
// over (0, π]).
function halfAngle(chord: number, length: number): number {
  let lo = 1e-6;
  let hi = Math.PI;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sin(mid) / mid > chord / length) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Every shape starts bottom-left and runs clockwise on screen: up the left
// edge (breathe in), across the top (hold), back down (breathe out).
function buildEdges(kind: ShapeKind, l: number[]): Edge[] {
  switch (kind) {
    case 'square': {
      const L = l[0];
      const A = { x: 0, y: L };
      const B = { x: 0, y: 0 };
      const C = { x: L, y: 0 };
      const D = { x: L, y: L };
      return [line(A, B), line(B, C), line(C, D), line(D, A)];
    }
    case 'triangle': {
      // Top edge horizontal, apex below it: sides a (up), b (across), c (down).
      const [a, b, c] = l;
      const B = { x: 0, y: 0 };
      const C = { x: b, y: 0 };
      const ax = (a * a - c * c + b * b) / (2 * b);
      const A = { x: ax, y: Math.sqrt(a * a - ax * ax) };
      return [line(A, B), line(B, C), line(C, A)];
    }
    case 'petal': {
      // Two straight edges, then an arc of exactly the third length back to
      // the start. A triangle with sides 3, 3, 6 would be flat; this is not.
      const [a, b, c] = l;
      const A = { x: 0, y: a };
      const B = { x: 0, y: 0 };
      const C = { x: b, y: 0 };
      const chord = Math.hypot(b, a);
      const x = halfAngle(chord, c);
      const r = c / (2 * x);
      const mid = { x: b / 2, y: a / 2 };
      const toB = { x: -mid.x / (chord / 2), y: -mid.y / (chord / 2) };
      const d = r * Math.cos(x); // centre sits toward B for a minor arc
      const center = { x: mid.x + toB.x * d, y: mid.y + toB.y * d };
      const start = Math.atan2(C.y - center.y, C.x - center.x);
      return [line(A, B), line(B, C), arc(center, r, start, 2 * x)];
    }
    case 'circle': {
      const total = l.reduce((s, v) => s + v, 0);
      const r = total / (2 * Math.PI);
      const center = { x: r, y: r };
      let start = Math.PI / 2; // bottom
      return l.map((len) => {
        const sweep = (2 * Math.PI * len) / total;
        const e = arc(center, r, start, sweep);
        start += sweep;
        return e;
      });
    }
  }
}

function bounds(edges: Edge[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const e of edges) {
    const n = e.kind === 'line' ? 1 : 64;
    for (let i = 0; i <= n; i++) {
      const p = pointAt(e, i / n);
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
  }
  return { minX, minY, maxX, maxY };
}

function transform(edges: Edge[], s: number, dx: number, dy: number): Edge[] {
  const map = (p: Pt) => ({ x: p.x * s + dx, y: p.y * s + dy });
  return edges.map((e) =>
    e.kind === 'line'
      ? line(map(e.from), map(e.to))
      : arc(map(e.center), e.r * s, e.start, e.sweep),
  );
}

export function buildShape(kind: ShapeKind, lengths: number[]): Geometry {
  const raw = buildEdges(kind, lengths);
  const b = bounds(raw);
  const edges = transform(raw, 1, -b.minX, -b.minY);
  return {
    edges,
    width: b.maxX - b.minX,
    height: b.maxY - b.minY,
    perimeter: edges.reduce((s, e) => s + e.length, 0),
  };
}

// Scale to fit a box of the given size and centre it, with a margin all round.
export function fitShape(g: Geometry, boxW: number, boxH: number, pad: number): Geometry {
  const s = Math.min((boxW - 2 * pad) / g.width, (boxH - 2 * pad) / g.height);
  const dx = (boxW - g.width * s) / 2;
  const dy = (boxH - g.height * s) / 2;
  return {
    edges: transform(g.edges, s, dx, dy),
    width: g.width * s,
    height: g.height * s,
    perimeter: g.perimeter * s,
  };
}

export function pathOf(g: Geometry): string {
  const first = pointAt(g.edges[0], 0);
  let d = `M ${first.x} ${first.y}`;
  for (const e of g.edges) {
    const end = pointAt(e, 1);
    if (e.kind === 'line') {
      d += ` L ${end.x} ${end.y}`;
    } else {
      const large = Math.abs(e.sweep) > Math.PI ? 1 : 0;
      const flag = e.sweep > 0 ? 1 : 0;
      d += ` A ${e.r} ${e.r} 0 ${large} ${flag} ${end.x} ${end.y}`;
    }
  }
  return d;
}

// Length travelled from the start, part-way along edge `index`
export function travelled(g: Geometry, index: number, t: number): number {
  let s = 0;
  for (let i = 0; i < index; i++) s += g.edges[i].length;
  return s + g.edges[index].length * t;
}
