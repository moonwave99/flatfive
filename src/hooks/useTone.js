import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { getTimeSignatureFromMeter } from '../lib/utils';
import { getSoundFontInfo } from '../lib/soundfonts';

const sampler = new Tone.Sampler(getSoundFontInfo()).toDestination();
let started = false;
let playMetronome = false;

function getPart({ chords, loop, setCurrentInfo }) {
  const partLength = chords[chords.length - 1].measure + 1;

  const part = new Tone.Part((time, value) => {
    sampler.triggerAttackRelease(value.notes, value.duration, time);
    Tone.Transport.scheduleOnce(() => {
      setCurrentInfo((prev) => {
        const notes = new Set(prev.notes);
        value.notes.forEach((x) => notes.delete(x));
        return {
          ...prev,
          notes: [...notes],
        };
      });
    }, ` +${value.duration}`);
    setCurrentInfo((prev) => {
      const notes = new Set(prev.notes);
      value.notes.forEach((x) => notes.add(x));
      return {
        line: value.line,
        measure: value.measure,
        absoluteIndex: value.absoluteIndex,
        relativeIndex: value.relativeIndex,
        notes: [...notes],
      };
    });
  }, chords);

  part.loop = loop;
  part.loopEnd = `${partLength}m`;
  return part;
}

export default function useTone({ chords, bpm, meter = '4/4' }) {
  const [isPlaying, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({
    notes: [],
    line: -1,
    measure: -1,
    absoluteIndex: -1,
    relativeIndex: -1,
  });

  const partRef = useRef(null);

  Tone.Transport.timeSignature = getTimeSignatureFromMeter(meter);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      return;
    }
    Tone.Transport.cancel();
    if (!chords.length) {
      return;
    }
    const metronome = new Tone.Loop((time) => {
      if (!playMetronome) {
        return;
      }
      sampler.triggerAttackRelease('C6', '32n', time);
    }, '4n').start(0);

    partRef.current = getPart({
      chords,
      loop,
      setCurrentInfo,
    });
  }, [chords, loop, isPlaying]);

  async function toggle() {
    if (!started) {
      await Tone.start();
      started = true;
    }
    if (isPlaying) {
      Tone.Transport.pause();
    } else {
      partRef.current?.start(0);
      Tone.Transport.toggle();
    }
    setPlaying((prev) => !prev);
  }

  function stop() {
    setPlaying(false);
    setCurrentInfo({
      notes: [],
      line: -1,
      measure: -1,
      absoluteIndex: -1,
      relativeIndex: -1,
    });
    Tone.Transport.stop();
  }

  function toggleMetronome() {
    playMetronome = !playMetronome;
    setMetronomeOn(playMetronome);
  }

  function togglePartLoop() {
    if (!partRef.current) {
      return;
    }
    partRef.current.loop = !partRef.current.loop;
    setLoop(partRef.current.loop);
  }

  return {
    toggle,
    stop,
    toggleMetronome,
    togglePartLoop,
    isPlaying,
    loop,
    metronomeOn,
    currentInfo,
  };
}
