import useAbc from './hooks/useAbc';

export default function MusicScore({
  chords,
  onChordClick,
  measure,
  relativeIndex,
  absoluteIndex,
  bars_per_row,
  meter,
  sketch_key,
}) {
  const ref = useAbc({
    chords,
    onChordClick,
    measure,
    relativeIndex,
    absoluteIndex,
    bars_per_row,
    meter,
    sketch_key,
  });
  return (
    <div className='music-score-wrapper'>
      <div className='music-score' ref={ref}></div>
    </div>
  );
}
