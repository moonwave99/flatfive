import { parse } from './parser';

test('parse', () => {
  const parsed = parse(`Dm7
G7
Cmaj7`);
  expect(parsed).toEqual([
    [
      {
        root: 'D',
        name: 'Dm7',
        duration: 1,
        notes: ['D4', 'F4', 'A4', 'C5'],
        chordIndex: 0,
        line: 1,
      },
    ],
    [
      {
        root: 'G',
        name: 'G7',
        duration: 1,
        notes: ['G4', 'B4', 'D5', 'F5'],
        chordIndex: 1,
        line: 2,
      },
    ],
    [
      {
        root: 'C',
        name: 'Cmaj7',
        duration: 1,
        notes: ['C4', 'E4', 'G4', 'B4'],
        chordIndex: 2,
        line: 3,
      },
    ],
  ]);
});
