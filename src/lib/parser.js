import { Chord } from '@tonaljs/tonal';
import { addIndexesToChords } from './utils';
import { isNumber } from 'lodash';

export const DEFAULT_BPM = 90;
const DEFAULT_DURATION = '1';
const DEFAULT_OCTAVE = 4;
const COMMENT_START = '#';

const allowedMetaProps = [
  {
    key: 'title',
    description: 'Sketch title',
    type: 'string',
  },
  {
    key: 'bpm',
    description: 'Sketch bpm',
    type: 'number',
  },
  {
    key: 'bars_per_row',
    description: 'Bars per row',
    local: 'barsPerRow',
    type: 'string',
  },
  {
    key: 'key',
    description: 'Sketch key',
    local: 'sketchKey',
    type: 'string',
  },
  {
    key: 'meter',
    description: 'Sketch meter',
    type: 'string',
  },
];

const allowedChordKeys = [
  {
    extended: 'duration',
    short: 'd',
    description: 'Duration of the chord',
    type: 'string',
  },
  {
    extended: 'voicing',
    short: 'v',
    description: 'Voicing of the chord',
    type: 'string',
  },
  {
    extended: 'label',
    short: 'l',
    description: 'Label applied to the chord',
    type: 'string',
  },
  {
    extended: 'octave',
    short: 'o',
    description: 'Octave of the root',
    type: 'number',
  },
];

const valueParsers = {
  string: (x) => x,
  number: (x) => +x,
};

function ensure(parsed) {
  return {
    ...parsed,
    meta: {
      barsPerRow: 4,
      sketchKey: 'C',
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
  allowedMetaProps.forEach((prop) => {
    const rx = new RegExp(`${prop.key}:(\s+)?(.*)`);
    const match = line.match(rx);
    if (match) {
      const value = valueParsers[prop.type](match[2].trim());
      result = { [prop.local || prop.key]: value };
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
  const chord = parseChord(head, info.octave);
  return {
    ...chord,
    ...info,
  };
}

function parseRest(rest = '') {
  const tokens = rest.split(',');
  const output = {
    duration: DEFAULT_DURATION,
    octave: DEFAULT_OCTAVE,
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
    output[prop.extended] = valueParsers[prop.type](value);
  });
  return output;
}

function getNote(x) {
  const match = x.match(/^([A-G])([b|#]+)?(.*)/);

  if (!match) {
    return {};
  }
  const [, note, accidental, rest] = match;
  let suffix = rest;

  let slash;
  if (rest) {
    const restMatch = `${rest}`.match(/\/([A-G])([b|#]+)?$/);
    if (restMatch) {
      const [slashMatch, slashNote, slashAccidental] = restMatch;
      slash = slashAccidental ? `${slashNote}${slashAccidental}` : slashNote;
      suffix = rest.replace(slashMatch, '');
    }
  }

  const root = accidental ? `${note}${accidental}` : note;

  return {
    root,
    slash,
    suffix,
    name: x,
  };
}

function parseChord(token, octave) {
  const { root, slash, suffix, name } = getNote(token);
  const { notes } = Chord.getChord(
    suffix,
    `${root}${octave}`,
    slash ? `${slash}${octave}` : null
  );

  return {
    name,
    root,
    notes,
  };
}
