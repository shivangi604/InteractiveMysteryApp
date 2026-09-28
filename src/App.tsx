import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";

type View = "intro" | "scene" | "board" | "reveal";
type ClueId = "camera" | "glass" | "receipt";

const CLUES: Record<
  ClueId,
  { index: string; label: string; title: string; detail: string; time: string }
> = {
  camera: {
    index: "01",
    label: "DAMAGED CAMERA",
    title: "The last photograph",
    detail:
      "The memory card survived. Its final frame was captured at 11:42 PM—eight minutes after Mara supposedly left the room.",
    time: "23:42",
  },
  glass: {
    index: "02",
    label: "BROKEN GLASS",
    title: "A second set of prints",
    detail:
      "The glass carries an unknown partial print beneath Mara's. The rim contains traces of a rare sedative.",
    time: "23:18",
  },
  receipt: {
    index: "03",
    label: "FOLDED RECEIPT",
    title: "A payment in cash",
    detail:
      "A roadside receipt from 10:56 PM. On the back: Room 17, a hand-drawn circle, and the initials E.V.",
    time: "22:56",
  },
};

const THEORIES = [
  {
    id: "escape",
    number: "A",
    title: "She staged her disappearance",
    text: "Mara planted the room and left before midnight.",
  },
  {
    id: "meeting",
    number: "B",
    title: "The meeting turned violent",
    text: "The unknown visitor arrived to exchange the camera.",
  },
  {
    id: "witness",
    number: "C",
    title: "The witness was the target",
    text: "Room 17 was never meant for Mara at all.",
  },
];

function Action({
  children,
  className = "",
  onClick,
  label,
}: {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  label?: string;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      aria-label={label}
      className={`action ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

function Mark() {
  return (
    <div className="mark" aria-label="Cold Case Division">
      <span className="mark-corners" />
      <span>CCD</span>
    </div>
  );
}

function Intro({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="intro">
      <div className="film-grain" />
      <div className="intro-orbit orbit-one" />
      <div className="intro-orbit orbit-two" />
      <div className="case-folder folder-left">
        <span>CASE 047</span>
      </div>
      <div className="case-folder folder-right">
        <span>UNRESOLVED</span>
      </div>
      <div className="intro-nav">
        <Mark />
        <div className="classification">CLASSIFIED / 04.17.96</div>
      </div>
      <div className="intro-copy">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          AN INTERACTIVE INVESTIGATION
        </div>
        <div className="title title-ghost">THE UNSOLVED</div>
        <div className="title">THE UNSOLVED</div>
        <div className="title title-accent">CASE</div>
        <p>
          Room 17 was sealed twenty-eight years ago. Tonight, a new piece of
          evidence has appeared.
        </p>
        <Action className="primary-action" onClick={onEnter} label="Enter the crime scene">
          <span>ENTER THE CRIME SCENE</span>
          <span className="action-arrow">↗</span>
        </Action>
      </div>
      <div className="intro-footer">
        <span>CASE FILE / 047–R</span>
        <span>Scroll to descend</span>
        <span>Evidence integrity: 86%</span>
      </div>
    </section>
  );
}

function Hotspot({
  clue,
  found,
  onClick,
}: {
  clue: ClueId;
  found: boolean;
  onClick: () => void;
}) {
  return (
    <Action
      className={`hotspot hotspot-${clue} ${found ? "is-found" : ""}`}
      onClick={onClick}
      label={`Investigate ${CLUES[clue].label}`}
    >
      <span className="hotspot-ring" />
      <span className="hotspot-core" />
      <span className="hotspot-label">
        <b>{CLUES[clue].index}</b>
        {found ? "EVIDENCE LOGGED" : CLUES[clue].label}
      </span>
    </Action>
  );
}

function EvidenceDrawer({
  clue,
  onClose,
}: {
  clue: ClueId;
  onClose: () => void;
}) {
  const evidence = CLUES[clue];
  return (
    <aside className="evidence-drawer">
      <div className="drawer-top">
        <span>EVIDENCE / {evidence.index}</span>
        <Action className="close-action" onClick={onClose} label="Close evidence">
          CLOSE ×
        </Action>
      </div>
      <div className={`evidence-object evidence-${clue}`}>
        <span />
      </div>
      <div className="evidence-time">{evidence.time}</div>
      <div className="drawer-title">{evidence.title}</div>
      <p>{evidence.detail}</p>
      <div className="evidence-meta">
        <span>STATUS</span>
        <b>VERIFIED</b>
        <span>CHAIN OF CUSTODY</span>
        <b>INTACT</b>
      </div>
    </aside>
  );
}

function Scene({
  clues,
  setClues,
  onBoard,
}: {
  clues: ClueId[];
  setClues: (value: ClueId[]) => void;
  onBoard: () => void;
}) {
  const [activeClue, setActiveClue] = useState<ClueId | null>(null);

  const inspect = (clue: ClueId) => {
    setActiveClue(clue);
    if (!clues.includes(clue)) setClues([...clues, clue]);
  };

  return (
    <section className="scene">
      <div className="film-grain" />
      <div className="scene-image" />
      <div className="room-depth">
        <div className="ceiling-beam" />
        <div className="floor-grid" />
        <div className="dust dust-one" />
        <div className="dust dust-two" />
        <div className="dust dust-three" />
      </div>
      <div className="scene-header">
        <Mark />
        <div className="scene-location">
          <span>NOW ENTERING</span>
          ROOM 17 / BLACKWATER MOTEL
        </div>
        <div className="clue-count">
          <b>{clues.length}</b> / 3 CLUES FOUND
        </div>
      </div>
      <div className="scene-prompt">
        <span>INVESTIGATION ACTIVE</span>
        <div>Look closer. Nothing here is accidental.</div>
      </div>
      {(Object.keys(CLUES) as ClueId[]).map((clue) => (
        <Hotspot
          clue={clue}
          found={clues.includes(clue)}
          key={clue}
          onClick={() => inspect(clue)}
        />
      ))}
      <div className="scene-footer">
        <span>DRAG TO LOOK AROUND</span>
        <span className="coordinates">44° 02′ 11″ N / 71° 40′ 03″ W</span>
        <Action
          className={`board-action ${clues.length === 3 ? "is-ready" : ""}`}
          onClick={clues.length === 3 ? onBoard : () => undefined}
          label="Open the evidence board"
        >
          {clues.length === 3 ? "OPEN EVIDENCE BOARD" : "FIND ALL EVIDENCE"}
          <span>→</span>
        </Action>
      </div>
      {activeClue && (
        <EvidenceDrawer clue={activeClue} onClose={() => setActiveClue(null)} />
      )}
    </section>
  );
}

function Board({ onReveal }: { onReveal: (theory: string) => void }) {
  const [selected, setSelected] = useState("");

  return (
    <section className="board">
      <div className="film-grain" />
      <div className="board-header">
        <Mark />
        <div>
          <span className="eyebrow">EVIDENCE BOARD / CASE 047</span>
          <div className="board-title">Connect what they left behind.</div>
        </div>
        <span className="board-status">3 CLUES / 3 THEORIES</span>
      </div>
      <div className="corkboard">
        <svg className="thread-map" viewBox="0 0 1000 500" aria-hidden="true">
          <path d="M210 170 L510 265 L805 135" />
          <path d="M510 265 L760 405" />
          <path d="M210 170 L250 405" />
        </svg>
        {(["camera", "glass", "receipt"] as ClueId[]).map((clue) => (
          <div className={`board-card card-${clue}`} key={clue}>
            <span className="pin" />
            <span className="card-index">{CLUES[clue].index}</span>
            <div className={`card-image card-image-${clue}`} />
            <b>{CLUES[clue].label}</b>
            <p>{CLUES[clue].detail}</p>
            <span className="card-time">{CLUES[clue].time}</span>
          </div>
        ))}
      </div>
      <div className="theory-panel">
        <div className="theory-heading">
          <span>CHOOSE YOUR THEORY</span>
          <p>Your conclusion will close the case.</p>
        </div>
        <div className="theory-list">
          {THEORIES.map((theory) => (
            <Action
              className={`theory ${selected === theory.id ? "is-selected" : ""}`}
              key={theory.id}
              label={`Select theory: ${theory.title}`}
              onClick={() => setSelected(theory.id)}
            >
              <span className="theory-number">{theory.number}</span>
              <span>
                <b>{theory.title}</b>
                <small>{theory.text}</small>
              </span>
              <span className="theory-check" />
            </Action>
          ))}
        </div>
        <Action
          className={`primary-action solve-action ${selected ? "" : "is-disabled"}`}
          label="Lock theory and reveal the truth"
          onClick={() => selected && onReveal(selected)}
        >
          LOCK THEORY & REVEAL THE TRUTH
          <span className="action-arrow">↗</span>
        </Action>
      </div>
    </section>
  );
}

function Reveal({ theory, onRestart }: { theory: string; onRestart: () => void }) {
  const correct = theory === "meeting";
  return (
    <section className="reveal">
      <div className="film-grain" />
      <div className="reveal-beam" />
      <div className="reveal-copy">
        <span className="eyebrow">CASE 047 / DECLASSIFIED</span>
        <div className="reveal-kicker">{correct ? "YOU SAW THE PATTERN" : "THE ROOM MISLED YOU"}</div>
        <div className="reveal-title">MARA NEVER LEFT ROOM 17.</div>
        <p>
          The visitor was Elias Vale, the detective assigned to protect her.
          He came for the camera, drugged the glass, and moved the scene after
          midnight. The final photo caught his reflection in the window.
        </p>
        <div className="truth-file">
          <span>THE TRUTH</span>
          <b>THE MEETING TURNED VIOLENT</b>
          <small>CONFIRMED BY FRAME 047-C / MIRROR ENHANCEMENT</small>
        </div>
        <Action className="secondary-action" onClick={onRestart} label="Reopen case">
          REOPEN THE CASE <span>↻</span>
        </Action>
      </div>
      <div className="reveal-photo">
        <span className="photo-stamp">EVIDENCE 047-C</span>
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<View>("intro");
  const [clues, setClues] = useState<ClueId[]>([]);
  const [theory, setTheory] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const moveTo = (next: View) => {
    setTransitioning(true);
    window.setTimeout(() => {
      setView(next);
      setTransitioning(false);
    }, 650);
  };

  useEffect(() => {
    document.body.dataset.view = view;
  }, [view]);

  const restart = () => {
    setClues([]);
    setTheory("");
    moveTo("intro");
  };

  return (
    <main className="app-shell">
      <div className={`cinematic-shutter ${transitioning ? "is-active" : ""}`}>
        <span>CASE 047</span>
      </div>
      {view === "intro" && <Intro onEnter={() => moveTo("scene")} />}
      {view === "scene" && (
        <Scene clues={clues} setClues={setClues} onBoard={() => moveTo("board")} />
      )}
      {view === "board" && (
        <Board
          onReveal={(value) => {
            setTheory(value);
            moveTo("reveal");
          }}
        />
      )}
      {view === "reveal" && <Reveal theory={theory} onRestart={restart} />}
    </main>
  );
}
