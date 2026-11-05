import { useState, useEffect, useRef } from "react";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";

// Prewritten fragments. Reset always returns to this list.
const starter_fragments = [
  { id: "s1", text: "a shamely affair deep in the bone" },
  { id: "s2", text: "sorrow that you have become servile to" },
  { id: "s3", text: "clotted blood cells on the surface of the knee" },
  { id: "s4", text: "insatiability"},
  { id: "s5", text: "enduring perversion stuck on the lips"},
  { id: "s6", text: "accumulated desire for material objects"},
  { id: "s7", text: "lasting chemical impressions"},
  { id: "s8", text: "reminants of acute periods of neurosis"},
  { id: "s9", text: "the warmth of the hand, of someone you no longer know"},
  { id: "s10", text: "symptoms mistaken for a cause"},
  { id: "s11", text: "an interiority cultivated by another body"},
  { id: "s12", text: "cuticles pulled bloody by teeth"},
  { id: "s13", text: "thick callouses of hard worked hands"}
];

let initialLibrary = localStorage.getItem("fragments");
let saved = initialLibrary != null ? JSON.parse(initialLibrary) : null;

export function Library() {
  let [bank, setBank] = useState(saved ? saved.bank : starter_fragments);
  let [placed, setPlaced] = useState(saved ? saved.placed : []);
  let bodyRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("fragments", JSON.stringify({ bank, placed }));
  }, [bank, placed]);

  function reset() {
    setBank(starter_fragments);
    setPlaced([]);
  }

  function handleDragEnd(event) {
    if (event.canceled) return;
    let { source, target } = event.operation;
    if (!source || !target) return;

    let id = source.id;
    let item =
      bank.find((f) => f.id === id) || placed.find((f) => f.id === id);
    if (!item) return;

    if (target.id === "body") {
      let rect = bodyRef.current.getBoundingClientRect();
      let { x: px, y: py } = event.operation.position.current;
      let x = ((px - rect.left) / rect.width) * 100;
      let y = ((py - rect.top) / rect.height) * 100;

      setBank(bank.filter((f) => f.id !== id));
      setPlaced([
        ...placed.filter((f) => f.id !== id),
        { id, text: item.text, x, y },
      ]);
    } else if (target.id === "bank") {
      // Dragged back off the body
      setPlaced(placed.filter((f) => f.id !== id));
      if (!bank.find((f) => f.id === id)) {
        setBank([...bank, { id, text: item.text }]);
      }
    }
  }


  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="layout">
        <aside className="bank-side">
          <Bank fragments={bank} />

        </aside>

        <Body placed={placed} bodyRef={bodyRef} />
    
        <aside className="add-side">
          <button onClick={reset}>Reset</button>
          <NewFragment
            onCreated={(text) =>
              setBank([...bank, { id: "u" + Date.now(), text }])
            }
          />
  
        </aside>
      </div>
    </DragDropProvider>
  );
}



function NewFragment({ onCreated }) {
  let [text, setText] = useState("");

  function submit() {
    onCreated(text.trim());
    setText("");
  }

  return (
    <div className="new-fragment">
      <input
        value={text}
        onInput={(e) => setText(e.target.value)}
        maxLength={60}
        placeholder="enter your own"
      />
      <button onClick={submit} disabled={text.trim() == ""}>
      add Fragment
      </button>
    </div>
  );
}

function Bank({ fragments }) {
  let { ref } = useDroppable({ id: "bank" });
  return (
    <ul className="bank" ref={ref}>
      {fragments.map((f) => (
        <Fragment key={f.id} id={f.id} text={f.text} />
      ))}
    </ul>
  );
}

function Body({ placed, bodyRef }) {
  let { ref } = useDroppable({ id: "body" });
  return (
    <main
      className="body"
      ref={(el) => {
        ref(el);
        bodyRef.current = el;
      }}
    >
      <img src="/images/body.png" alt="body" draggable={false} />
      {placed.map((f) => (
        <Fragment
          key={f.id}
          id={f.id}
          text={f.text}
          style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%` }}
        />
      ))}
    </main>
  );
}

function Fragment({ id, text, style }) {
  let { ref } = useDraggable({ id });
  return (
    <li ref={ref} className="fragment" style={style}>
      {text}
    </li>
  );
}
