import { useEffect, useRef } from 'react';
import { renderAbc } from 'abcjs';
import { AbcNotation } from '@tonaljs/tonal';
import { chunk, groupBy, toArray } from 'lodash';
import { fractionToAbc } from '../lib/utils';

function renderChordLabel(chord) {
  if (!chord.label) {
    return '';
  }
  return `"${chord.label}" `;
}

function chordToAbc(chord) {
  if (chord.name === '-') {
    return `z/${fractionToAbc(chord.duration)}`;
  }
  return `${renderChordLabel(chord)}[${chord.notes
    .map(AbcNotation.scientificToAbcNotation)
    .join('')}]/${fractionToAbc(chord.duration)}`;
}

function chordsToAbc({ chords, bars_per_row, meter, sketch_key }) {
  const rows = chunk(toArray(groupBy(chords, 'measure')), bars_per_row);
  return `
K:${sketch_key}
L:1
M:${meter}
${rows
  .map((measures) =>
    measures.map((x) => x.map(chordToAbc).join(' ')).join(' | ')
  )
  .join('|\n')}||`;
}

function parseClasses(classes) {
  const output = {};
  classes.split(' ').forEach((x) => {
    const measureMatch = x.match(/abcjs-mm([\d+])/);
    if (measureMatch) {
      output.measure = +measureMatch[measureMatch.length - 1];
    }
    const indexMatch = x.match(/abcjs-n([\d+])/);
    if (indexMatch) {
      output.index = +indexMatch[indexMatch.length - 1];
    }
  });
  return output;
}

export default function useAbc({
  chords,
  measure,
  absoluteIndex,
  relativeIndex,
  onChordClick,
  bars_per_row,
  meter,
  sketch_key,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    renderAbc(
      ref.current,
      chordsToAbc({ chords, bars_per_row, meter, sketch_key }),
      {
        responsive: 'resize',
        add_classes: true,
        oneSvgPerLine: true,
        clickListener: (_abcelem, _tuneNumber, classes) =>
          onChordClick(parseClasses(classes)),
      }
    );
  }, [chords, bars_per_row, meter, sketch_key, onChordClick]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current
      .querySelectorAll('.abcjs-note')
      .forEach((el) => el.classList.remove('current'));
    ref.current
      .querySelectorAll(`.abcjs-mm${measure}.abcjs-n${relativeIndex}`)
      .forEach((el) => el.classList.add('current'));
  }, [measure, absoluteIndex, relativeIndex]);

  return ref;
}
