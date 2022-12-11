import { useEffect, useRef } from "react";
import { Paino } from "@moonwave99/paino";

export default function usePaino({ notes, octaves = 7 }) {
  const ref = useRef(null);
  const pianoRef = useRef(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (!pianoRef.current) {
      pianoRef.current = new Paino({
        el: ref.current,
        octaves,
        startOctave: 2
      });
      pianoRef.current.render();
    }
    pianoRef.current.setNotes(notes);
  }, [notes, octaves]);

  return ref;
}
