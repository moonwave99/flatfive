import { Chord } from '@tonaljs/tonal';
import { addIndexesToChords } from './utils';

export const DEFAULT_BPM = 90;
export const BASE_OCTAVE = 4;
const COMMENT_START = '#';

const allowedMetaKeys = [
  {
    extended: 'title',
    description: 'Sketch title',
  },
  {
    extended: 'bpm',
    description: 'Sketch bpm',
  },
  {
    extended: 'bars_per_row',
    description: 'Bars per row',
  },
  {
    extended: 'sketch_key',
    description: 'Sketch key',
  },
  {
    extended: 'meter',
    description: 'Sketch meter',
  },
];

const allowedChordKeys = [
  {
    extended: 'duration',
    short: 'd',
    description: 'Duration of the chord',
  },
  {
    extended: 'voicing',
    short: 'v',
    description: 'Voicing of the chord',
  },
  {
    extended: 'label',
    short: 'l',
    description: 'Label applied to the chord',
  },
];

function ensure(parsed) {
  return {
    ...parsed,
    meta: {
      bars_per_row: 4,
      sketch_key: 'C',
      meter: '4/4',
      bpm: DEFAULT_BPM,
      ...parsed.meta,
    },
  };
}

function getChordPropertyByKey(key) {
  return allowedChordKeys.find((x) => x.short === key || x.extended === key);
}

function parseMetaProperty(line) {
  let result = null;
  allowedMetaKeys.forEach((key) => {
    const rx = new RegExp(`${key.extended}:(\s+)?(.*)`);
    const match = line.match(rx);
    if (match) {
      result = { [key.extended]: match[2].trim() };
    }
  });
  return result;
}

export function parse(sequence = '') {
  const lines = sequence.split('\n');
  const sketch = lines
    .map((x, index) => ({ content: x, line: index + 1 }))
    .filter((x) => !!x.content && !x.content.startsWith(COMMENT_START))
    .reduce(
      (memo, x) => {
        const props = parseMetaProperty(x.content);
        if (props) {
          return {
            ...memo,
            meta: {
              ...memo.meta,
              ...props,
            },
          };
        }
        const parsedChord = parseLine(x.content);
        return {
          ...memo,
          chords: [...memo.chords, { ...parsedChord, line: x.line }],
        };
      },
      {
        meta: {},
        chords: [],
      }
    );
  return ensure({
    ...sketch,
    chords: addIndexesToChords(sketch.chords),
  });
}

function parseLine(line) {
  const [head, ...rest] = line.trim().split(/\s+/);
  const info = parseRest(rest.join(' '));
  const chord = parseChord(head);
  return {
    ...chord,
    ...info,
  };
}

function parseRest(rest = '') {
  const tokens = rest.split(',');
  const output = {
    duration: '1',
  };
  tokens.forEach((token) => {
    const match = token.match(/([\w]):(?:\s+)?(.*)/);
    if (!match) {
      return;
    }
    const [, key, value] = match;
    const prop = getChordPropertyByKey(key);
    if (!prop) {
      console.warn(`Key '${key}' with value '${value}' is not identified`);
      return;
    }
    output[prop.extended] = value;
  });
  return output;
}

function parseChord(token) {
  const chord = Chord.get(token);

  const suffix = chord.symbol.replace(chord.tonic, '');
  const { notes } = Chord.getChord(suffix, `${chord.tonic}${BASE_OCTAVE}`);

  return {
    name: chord.symbol,
    root: chord.tonic,
    notes,
  };
}
