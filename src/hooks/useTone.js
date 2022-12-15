import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Note } from '@tonaljs/tonal';
import { getTimeSignatureFromMeter } from '../lib/utils';
import { getSoundFontInfo } from '../lib/soundfonts';
import { METRONOME_VOLUME } from '../lib/config';

const sampler = new Tone.Sampler(getSoundFontInfo()).toDestination();
const metronomeSampler = new Tone.Sampler({
  urls: {
    C3: '/samples/click.wav',
  },
}).toDestination();
metronomeSampler.volume.value = METRONOME_VOLUME;
let started = false;
let playMetronome = false;
let clickCount = 0;

function getPart({ chords, loop, setCurrentInfo }) {
  const partLength = chords[chords.length - 1].measure + 1;

  const part = new Tone.Part((time, value) => {
    const notes = value.notes.map(Note.simplify);
    sampler.triggerAttackRelease(notes, value.duration, time);
    Tone.Transport.scheduleOnce(() => {
      setCurrentInfo((prev) => {
        const noteSet = new Set(prev.notes);
        notes.forEach((x) => noteSet.delete(x));
        return {
          ...prev,
          notes: [...noteSet],
        };
      });
    }, ` +${value.duration}`);
    setCurrentInfo((prev) => {
      const noteSet = new Set(prev.notes);
      notes.forEach((x) => noteSet.add(x));
      return {
        line: value.line,
        measure: value.measure,
        absoluteIndex: value.absoluteIndex,
        relativeIndex: value.relativeIndex,
        notes: [...noteSet],
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
  const timeSignature = getTimeSignatureFromMeter(meter);

  Tone.Transport.timeSignature = timeSignature;

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
      metronomeSampler.triggerAttackRelease(
        `C${clickCount === 0 ? 4 : 3}`,
        '16n',
        time
      );
      clickCount++;
      if (clickCount === timeSignature[0]) {
        clickCount = 0;
      }
    }, '4n').start(0);

    partRef.current = getPart({
      chords,
      loop,
      setCurrentInfo,
    });
  }, [chords, loop, isPlaying, timeSignature]);

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
    clickCount = 0;
    Tone.Transport.stop();
  }

  function toggleMetronome() {
    playMetronome = !playMetronome;
    metronomeSampler.volume.value = playMetronome
      ? METRONOME_VOLUME
      : -Infinity;
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
