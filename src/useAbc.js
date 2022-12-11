import { useEffect, useRef } from "react";
import { renderAbc } from "abcjs";
import { AbcNotation } from "@tonaljs/tonal";
import { chunk } from "lodash";
import { fractionToAbc } from "./lib/utils";

function renderChordLabel(chord) {
  if (!chord.label) {
    return "";
  }
  return `"${chord.label}" `;
}

function chordToAbc(chord) {
  if (chord.name === "-") {
    return `z/${fractionToAbc(chord.duration)}`;
  }
  return `${renderChordLabel(chord)}[${chord.notes
    .map(AbcNotation.scientificToAbcNotation)
    .join("")}]/${fractionToAbc(chord.duration)}`;
}

function partToAbc(measures) {
  const rows = chunk(measures, 4);
  return `
K:C
L:1
M:4/4
${rows
  .map((measures) =>
    measures.map((x) => x.map(chordToAbc).join(" ")).join(" | ")
  )
  .join("|\n")}||`;
}

function parseClasses(classes) {
  const output = {};
  classes.split(" ").forEach((x) => {
    const measureMatch = x.match(/abcjs-mm([\d+])/);
    if (measureMatch) {
      output.measure = +measureMatch.at(-1);
    }
    const indexMatch = x.match(/abcjs-n([\d+])/);
    if (indexMatch) {
      output.index = +indexMatch.at(-1);
    }
  });
  return output;
}

export default function useAbc({
  part,
  measureIndex,
  chordIndex,
  relativeIndex,
  onChordClick
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    renderAbc(ref.current, partToAbc(part), {
      responsive: "resize",
      add_classes: true,
      oneSvgPerLine: true,
      clickListener: (_abcelem, _tuneNumber, classes) =>
        onChordClick(parseClasses(classes))
    });
  }, [part, onChordClick]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current
      .querySelectorAll(".abcjs-note")
      .forEach((el) => el.classList.remove("current"));
    ref.current
      .querySelectorAll(`.abcjs-mm${measureIndex}.abcjs-n${relativeIndex}`)
      .forEach((el) => {
        el.classList.add("current");
      });
  }, [measureIndex, chordIndex, relativeIndex]);

  return ref;
}
