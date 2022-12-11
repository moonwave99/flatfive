import useAbc from "./useAbc";

export default function MusicScore({
  part,
  onChordClick,
  measureIndex,
  chordIndex,
  relativeIndex
}) {
  const ref = useAbc({
    part,
    relativeIndex,
    measureIndex,
    chordIndex,
    onChordClick
  });
  return (
    <div className="music-score-wrapper">
      <div className="music-score" ref={ref}></div>
    </div>
  );
}
