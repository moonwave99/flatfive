import produce from 'immer';

export const createUISlice = (set) => ({
  showPiano: true,
  togglePiano: () =>
    set(
      produce((state) => {
        state.showPiano = !state.showPiano;
      })
    ),
});
