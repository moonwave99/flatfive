import useAbc from './hooks/useAbc';

export default function MusicScore({
  chords,
  onChordClick,
  measure,
  relativeIndex,
  absoluteIndex,
  barsPerRow,
  meter,
  sketchKey,
}) {
  const ref = useAbc({
    chords,
    onChordClick,
    measure,
    relativeIndex,
    absoluteIndex,
    barsPerRow,
    meter,
    sketchKey,
  });
  return (
    <div className='music-score-wrapper'>
      <div className='music-score' ref={ref}></div>
    </div>
  );
}
