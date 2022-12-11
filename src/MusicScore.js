import useAbc from './useAbc';

export default function MusicScore({
  part,
  onChordClick,
  measure,
  relativeIndex,
  absoluteIndex,
}) {
  const ref = useAbc({
    part,
    onChordClick,
    measure,
    relativeIndex,
    absoluteIndex,
  });
  return (
    <div className='music-score-wrapper'>
      <div className='music-score' ref={ref}></div>
    </div>
  );
}
