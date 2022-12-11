import { Chord } from '@tonaljs/tonal';
import { groupInMeasures } from './utils';

export const BASE_OCTAVE = 4;

// // this is a comment
// Dm7 l: 8n, v: drop 2

const allowedKeys = [
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

function getPropertyByKey(key) {
  return allowedKeys.find((x) => x.short === key || x.extended === key);
}

export function parse(sequence = '') {
  const lines = sequence.split('\n');
  const part = lines
    .map((x, index) => ({ content: x, line: index + 1 }))
    .filter((x) => !!x.content && !x.content.startsWith('//'))
    .map((x) => ({
      line: x.line,
      ...parseLine(x.content),
    }));
  return groupInMeasures(part);
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
    duration: 1,
  };
  tokens.forEach((token) => {
    const match = token.match(/([\w]):(?:\s+)?(.*)/);
    if (!match) {
      return;
    }
    const [, key, value] = match;
    const prop = getPropertyByKey(key);
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
