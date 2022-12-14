import { parse } from './parser';

test('parse - chords only', () => {
  const parsed = parse(`Dm7
G7
Cmaj7`);
  expect(parsed.chords).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1',
      octave: 4,
      notes: ['D4', 'F4', 'A4', 'C5'],
      line: 1,
      measure: 0,
      absoluteIndex: 0,
      relativeIndex: 0,
      time: '0:0:0',
    },
    {
      root: 'G',
      name: 'G7',
      duration: '1',
      octave: 4,
      notes: ['G4', 'B4', 'D5', 'F5'],
      line: 2,
      measure: 1,
      absoluteIndex: 1,
      relativeIndex: 0,
      time: '1:0:0',
    },
    {
      root: 'C',
      name: 'Cmaj7',
      duration: '1',
      octave: 4,
      notes: ['C4', 'E4', 'G4', 'B4'],
      line: 3,
      measure: 2,
      absoluteIndex: 2,
      relativeIndex: 0,
      time: '2:0:0',
    },
  ]);
});

test('parse - slash chords', () => {
  const parsed = parse(`C9/Bb
G/B
Am`);
  expect(parsed.chords).toEqual([
    {
      root: 'C',
      name: 'C9/Bb',
      duration: '1',
      octave: 4,
      notes: ['Bb4', 'D5', 'C5', 'E5', 'G5'],
      line: 1,
      measure: 0,
      absoluteIndex: 0,
      relativeIndex: 0,
      time: '0:0:0',
    },
    {
      root: 'G',
      name: 'G/B',
      duration: '1',
      octave: 4,
      notes: ['B4', 'D5', 'G5'],
      line: 2,
      measure: 1,
      absoluteIndex: 1,
      relativeIndex: 0,
      time: '1:0:0',
    },
    {
      root: 'A',
      name: 'Am',
      duration: '1',
      octave: 4,
      notes: ['A4', 'C5', 'E5'],
      line: 3,
      measure: 2,
      absoluteIndex: 2,
      relativeIndex: 0,
      time: '2:0:0',
    },
  ]);
});

test('parse - chords with durations', () => {
  const parsed = parse(`Dm7 d: 1/2
G7  d: 1/2
Cmaj7`);
  expect(parsed.chords).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1/2',
      octave: 4,
      notes: ['D4', 'F4', 'A4', 'C5'],
      line: 1,
      measure: 0,
      absoluteIndex: 0,
      relativeIndex: 0,
      time: '0:0:0',
    },
    {
      root: 'G',
      name: 'G7',
      duration: '1/2',
      octave: 4,
      notes: ['G4', 'B4', 'D5', 'F5'],
      line: 2,
      measure: 0,
      absoluteIndex: 1,
      relativeIndex: 1,
      time: '0:2:0',
    },
    {
      root: 'C',
      name: 'Cmaj7',
      duration: '1',
      octave: 4,
      notes: ['C4', 'E4', 'G4', 'B4'],
      line: 3,
      measure: 1,
      absoluteIndex: 2,
      relativeIndex: 0,
      time: '1:0:0',
    },
  ]);
});

test('parse - chords with octaves', () => {
  const parsed = parse(`Dm7 d: 1/2, o: 3
G7  d: 1/2, o: 2
Cmaj7`);
  expect(parsed.chords).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1/2',
      octave: 3,
      notes: ['D3', 'F3', 'A3', 'C4'],
      line: 1,
      measure: 0,
      absoluteIndex: 0,
      relativeIndex: 0,
      time: '0:0:0',
    },
    {
      root: 'G',
      name: 'G7',
      duration: '1/2',
      octave: 2,
      notes: ['G2', 'B2', 'D3', 'F3'],
      line: 2,
      measure: 0,
      absoluteIndex: 1,
      relativeIndex: 1,
      time: '0:2:0',
    },
    {
      root: 'C',
      name: 'Cmaj7',
      duration: '1',
      octave: 4,
      notes: ['C4', 'E4', 'G4', 'B4'],
      line: 3,
      measure: 1,
      absoluteIndex: 2,
      relativeIndex: 0,
      time: '1:0:0',
    },
  ]);
});

test('parse - custom props', () => {
  const parsed = parse(`Dm7 l: ii7, v: shell-a
G7  l: V7, v: shell-b
Cmaj7 l: Imaj7, v: shell-a`);
  expect(parsed.chords).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1',
      octave: 4,
      notes: ['D4', 'F4', 'A4', 'C5'],
      line: 1,
      measure: 0,
      absoluteIndex: 0,
      relativeIndex: 0,
      time: '0:0:0',
      voicing: 'shell-a',
      label: 'ii7',
    },
    {
      root: 'G',
      name: 'G7',
      duration: '1',
      octave: 4,
      notes: ['G4', 'B4', 'D5', 'F5'],
      line: 2,
      measure: 1,
      absoluteIndex: 1,
      relativeIndex: 0,
      time: '1:0:0',
      voicing: 'shell-b',
      label: 'V7',
    },
    {
      root: 'C',
      name: 'Cmaj7',
      duration: '1',
      octave: 4,
      notes: ['C4', 'E4', 'G4', 'B4'],
      line: 3,
      measure: 2,
      absoluteIndex: 2,
      relativeIndex: 0,
      time: '2:0:0',
      voicing: 'shell-a',
      label: 'Imaj7',
    },
  ]);
});

test('parse - meta with defaults', () => {
  const parsed = parse(`Dm7
G7
Cmaj7`);
  expect(parsed).toEqual({
    meta: {
      barsPerRow: 4,
      bpm: 90,
      meter: '4/4',
      sketchKey: 'C',
    },
    chords: [
      {
        root: 'D',
        name: 'Dm7',
        duration: '1',
        octave: 4,
        notes: ['D4', 'F4', 'A4', 'C5'],
        line: 1,
        measure: 0,
        absoluteIndex: 0,
        relativeIndex: 0,
        time: '0:0:0',
      },
      {
        root: 'G',
        name: 'G7',
        duration: '1',
        octave: 4,
        notes: ['G4', 'B4', 'D5', 'F5'],
        line: 2,
        measure: 1,
        absoluteIndex: 1,
        relativeIndex: 0,
        time: '1:0:0',
      },
      {
        root: 'C',
        name: 'Cmaj7',
        duration: '1',
        octave: 4,
        notes: ['C4', 'E4', 'G4', 'B4'],
        line: 3,
        measure: 2,
        absoluteIndex: 2,
        relativeIndex: 0,
        time: '2:0:0',
      },
    ],
  });
});

test('parse - meta with custom props', () => {
  const parsed = parse(`title: my sketch
key: G
bpm: 120
Am7
D7
Gmaj7`);
  expect(parsed).toEqual({
    meta: {
      title: 'my sketch',
      sketchKey: 'G',
      bpm: 120,
      barsPerRow: 4,
      meter: '4/4',
    },
    chords: [
      {
        root: 'A',
        name: 'Am7',
        duration: '1',
        octave: 4,
        notes: ['A4', 'C5', 'E5', 'G5'],
        line: 4,
        measure: 0,
        absoluteIndex: 0,
        relativeIndex: 0,
        time: '0:0:0',
      },
      {
        root: 'D',
        name: 'D7',
        duration: '1',
        octave: 4,
        notes: ['D4', 'F#4', 'A4', 'C5'],
        line: 5,
        measure: 1,
        absoluteIndex: 1,
        relativeIndex: 0,
        time: '1:0:0',
      },
      {
        root: 'G',
        name: 'Gmaj7',
        duration: '1',
        octave: 4,
        notes: ['G4', 'B4', 'D5', 'F#5'],
        line: 6,
        measure: 2,
        absoluteIndex: 2,
        relativeIndex: 0,
        time: '2:0:0',
      },
    ],
  });
});
