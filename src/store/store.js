import { createUISlice } from './slices/uiSlice';
import { createSketchSlice } from './slices/sketchSlice';
import create from 'zustand';

export const useStore = create((...a) => ({
  ...createUISlice(...a),
  ...createSketchSlice(...a),
}));
