import produce from 'immer';
import { parse } from '../../lib/parser';

export const INITAL_SKETCH_SOURCE = `# hello!
# see the Help section to know how to write your sketch
key: Em
meter: 4/4
title: My New Sketch

# write chords below on separate lines`;

const INITIAL_SKETCH = parse(INITAL_SKETCH_SOURCE);

export const createSketchSlice = (set) => ({
  currentSketch: INITIAL_SKETCH,
  allSketches: [],
  newSketch: () =>
    set(
      produce((state) => {
        state.currentSketch = INITIAL_SKETCH;
        state.source = INITAL_SKETCH_SOURCE;
      })
    ),
  updateCurrentSlice: (source) =>
    set(
      produce((state) => {
        const parsed = parse(source);
        state.currentSketch = parsed;
      })
    ),
});
