/**
 * Technical line illustrations used until real photographs are supplied.
 * They are decorative (the surrounding text carries the meaning), so they are
 * hidden from assistive technology.
 */
import type { ServiceIllustration } from "@/data/services";
import { cn } from "@/lib/utils";

export type IllustrationTone = "light" | "dark";

interface Palette {
  line: string;
  faint: string;
  water: string;
  waterEdge: string;
  sediment: string;
  label: string;
  accent: string;
}

const palettes: Record<IllustrationTone, Palette> = {
  light: {
    line: "#12345c",
    faint: "#c9cdd3",
    water: "#d8edf8",
    waterEdge: "#1a89ca",
    sediment: "#8d9299",
    label: "#1d4570",
    accent: "#136fa6",
  },
  dark: {
    line: "rgba(255,255,255,0.78)",
    faint: "rgba(255,255,255,0.18)",
    water: "rgba(26,137,202,0.32)",
    waterEdge: "#4ba7db",
    sediment: "#8d9299",
    label: "#afd9f0",
    accent: "#7fc1e6",
  },
};

interface IllustrationProps {
  tone?: IllustrationTone;
  className?: string;
  /** Show annotation labels (hide at very small sizes). */
  annotated?: boolean;
}

function SedimentPattern({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.1" fill={color} />
      <circle cx="6" cy="6" r="0.8" fill={color} />
    </pattern>
  );
}

function Label({
  x,
  y,
  fromX,
  fromY,
  text,
  p,
  anchor = "start",
}: {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  text: string;
  p: Palette;
  anchor?: "start" | "end";
}) {
  const elbowX = anchor === "start" ? x - 6 : x + 6;
  return (
    <g>
      <circle cx={fromX} cy={fromY} r="3" fill={p.accent} />
      <path
        d={`M${fromX} ${fromY} L${elbowX} ${y - 4} L${x} ${y - 4}`}
        fill="none"
        stroke={p.label}
        strokeWidth="1"
      />
      <text
        x={anchor === "start" ? x + 4 : x - 4}
        y={y}
        fill={p.label}
        fontSize="12"
        fontFamily="inherit"
        fontWeight="600"
        letterSpacing="0.06em"
        textAnchor={anchor}
      >
        {text.toUpperCase()}
      </text>
    </g>
  );
}

function GaugeTicks({ x, top, bottom, p }: { x: number; top: number; bottom: number; p: Palette }) {
  const ticks: number[] = [];
  for (let y = top; y <= bottom; y += 13) ticks.push(y);
  return (
    <g stroke={p.faint} strokeWidth="1">
      {ticks.map((y, i) => (
        <line key={y} x1={x} x2={x + (i % 5 === 0 ? 14 : 7)} y1={y} y2={y} />
      ))}
    </g>
  );
}

export function TankCrossSection({
  tone = "light",
  className,
  annotated = true,
}: IllustrationProps) {
  const p = palettes[tone];
  const sedimentId = `sediment-tank-${tone}`;
  return (
    <svg
      viewBox="0 0 480 400"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <SedimentPattern id={sedimentId} color={p.sediment} />
      </defs>
      <GaugeTicks x={86} top={74} bottom={330} p={p} />
      {/* Water */}
      <path
        d="M123 134 q 19 -7 39 0 t 39 0 t 39 0 t 39 0 t 39 0 t 39 0 V 326 H123 Z"
        fill={p.water}
      />
      <path
        d="M123 134 q 19 -7 39 0 t 39 0 t 39 0 t 39 0 t 39 0 t 39 0"
        fill="none"
        stroke={p.waterEdge}
        strokeWidth="2"
      />
      {/* Sediment */}
      <path
        d="M123 326 V303 q 28 -9 58 -3 t 60 2 t 62 -5 t 54 3 V326 Z"
        fill={`url(#${sedimentId})`}
        stroke={p.sediment}
        strokeWidth="1"
      />
      {/* Tank body */}
      <rect
        x="120"
        y="72"
        width="240"
        height="258"
        rx="12"
        fill="none"
        stroke={p.line}
        strokeWidth="2.5"
      />
      <rect
        x="198"
        y="58"
        width="84"
        height="14"
        rx="3"
        fill="none"
        stroke={p.line}
        strokeWidth="2"
      />
      {/* Inlet */}
      <path
        d="M30 98 H120 M120 98 H146 V116"
        fill="none"
        stroke={p.line}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Outlet */}
      <path d="M360 312 H452" fill="none" stroke={p.line} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M432 304 v16" stroke={p.line} strokeWidth="2.5" />
      {/* Base */}
      <path d="M140 330 v24 M340 330 v24 M110 354 H370" stroke={p.faint} strokeWidth="2" />
      {annotated ? (
        <>
          <Label fromX={146} fromY={116} x={110} y={60} text="Inlet" p={p} anchor="end" />
          <Label fromX={357} fromY={134} x={378} y={112} text="Water level" p={p} />
          <Label fromX={300} fromY={312} x={376} y={364} text="Sediment" p={p} />
        </>
      ) : null}
    </svg>
  );
}

export function SumpDiagram({ tone = "light", className, annotated = true }: IllustrationProps) {
  const p = palettes[tone];
  const sedimentId = `sediment-sump-${tone}`;
  return (
    <svg
      viewBox="0 0 480 400"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <SedimentPattern id={sedimentId} color={p.sediment} />
        <pattern
          id={`ground-${tone}`}
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="10" stroke={p.faint} strokeWidth="2" />
        </pattern>
      </defs>
      {/* Overhead tank */}
      <rect
        x="300"
        y="40"
        width="130"
        height="90"
        rx="8"
        fill="none"
        stroke={p.line}
        strokeWidth="2"
      />
      <path d="M302 78 q 16 -5 32 0 t 32 0 t 32 0 t 30 0 V 128 H302 Z" fill={p.water} />
      {/* Ground */}
      <rect x="0" y="200" width="480" height="200" fill={`url(#ground-${tone})`} />
      <line x1="0" y1="200" x2="480" y2="200" stroke={p.line} strokeWidth="2" />
      {/* Sump */}
      <rect
        x="72"
        y="222"
        width="216"
        height="146"
        fill={tone === "dark" ? "#061c36" : "#ffffff"}
      />
      <path
        d="M72 262 q 18 -6 36 0 t 36 0 t 36 0 t 36 0 t 36 0 t 36 0 V 366 H72 Z"
        fill={p.water}
      />
      <path
        d="M72 366 V350 q 30 -8 60 -2 t 60 2 t 60 -3 t 36 1 V366 Z"
        fill={`url(#${sedimentId})`}
        stroke={p.sediment}
      />
      <rect
        x="70"
        y="220"
        width="220"
        height="150"
        rx="6"
        fill="none"
        stroke={p.line}
        strokeWidth="2.5"
      />
      {/* Manhole cover */}
      <rect x="140" y="192" width="70" height="10" rx="2" fill={p.line} />
      {/* Pump and riser */}
      <rect
        x="236"
        y="172"
        width="34"
        height="26"
        rx="4"
        fill="none"
        stroke={p.accent}
        strokeWidth="2"
      />
      <path d="M253 198 V340" stroke={p.accent} strokeWidth="3" />
      <path d="M270 184 H365 V130" fill="none" stroke={p.accent} strokeWidth="3" />
      {annotated ? (
        <>
          <Label fromX={175} fromY={196} x={30} y={160} text="Sump cover" p={p} />
          <Label fromX={253} fromY={185} x={214} y={150} text="Pump" p={p} anchor="end" />
          <Label fromX={250} fromY={356} x={318} y={392} text="Sediment" p={p} />
          <Label fromX={430} fromY={60} x={470} y={24} text="Overhead tank" p={p} anchor="end" />
        </>
      ) : null}
    </svg>
  );
}

export function CommercialDiagram({
  tone = "light",
  className,
  annotated = true,
}: IllustrationProps) {
  const p = palettes[tone];
  const windows: { x: number; y: number }[] = [];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 4; col++) windows.push({ x: 150 + col * 48, y: 150 + row * 40 });
  }
  return (
    <svg
      viewBox="0 0 480 400"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Building */}
      <rect
        x="130"
        y="130"
        width="200"
        height="230"
        fill="none"
        stroke={p.line}
        strokeWidth="2.5"
      />
      {windows.map((w) => (
        <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="24" height="20" rx="2" fill={p.faint} />
      ))}
      <line x1="40" y1="360" x2="440" y2="360" stroke={p.line} strokeWidth="2" />
      {/* Rooftop tanks */}
      {[150, 210, 270].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="84"
            width="44"
            height="40"
            rx="6"
            fill="none"
            stroke={p.line}
            strokeWidth="2"
          />
          <path d={`M${x + 2} 102 q 10 -4 20 0 t 20 0 V 122 H${x + 2} Z`} fill={p.water} />
          <path d={`M${x + 8} 124 v6 M${x + 36} 124 v6`} stroke={p.line} strokeWidth="2" />
        </g>
      ))}
      {/* Riser */}
      <path d="M350 330 V104 H316" fill="none" stroke={p.accent} strokeWidth="3" />
      {/* Ground sump */}
      <rect
        x="340"
        y="330"
        width="90"
        height="30"
        rx="4"
        fill="none"
        stroke={p.line}
        strokeWidth="2"
      />
      <path d="M342 342 q 11 -4 22 0 t 22 0 t 22 0 t 20 0 V 358 H342 Z" fill={p.water} />
      {annotated ? (
        <>
          <Label fromX={172} fromY={90} x={40} y={50} text="Multiple tanks" p={p} />
          <Label fromX={400} fromY={336} x={470} y={300} text="Shared sump" p={p} anchor="end" />
        </>
      ) : null}
    </svg>
  );
}

export function ServiceIllustrationView({
  kind,
  ...props
}: IllustrationProps & { kind: ServiceIllustration }) {
  switch (kind) {
    case "tank":
      return <TankCrossSection {...props} />;
    case "sump":
      return <SumpDiagram {...props} />;
    case "commercial":
      return <CommercialDiagram {...props} />;
  }
}

/** Quiet horizontal water lines for section backgrounds. */
export function WaterLines({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("pointer-events-none w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {[20, 50, 80].map((y, i) => (
        <path
          key={y}
          d={`M0 ${y} q 75 -${10 - i * 2} 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0 t 150 0`}
          fill="none"
          stroke={color}
          strokeOpacity={0.5 - i * 0.14}
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}
