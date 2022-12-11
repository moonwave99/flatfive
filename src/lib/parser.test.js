import { parse } from './parser';

test('parse - chords only', () => {
  const parsed = parse(`Dm7
G7
Cmaj7`);
  expect(parsed).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1',
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
      notes: ['C4', 'E4', 'G4', 'B4'],
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
  expect(parsed).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1/2',
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
  expect(parsed).toEqual([
    {
      root: 'D',
      name: 'Dm7',
      duration: '1',
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
