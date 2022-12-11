import { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { getSoundFontInfo } from "./lib/soundfonts";

export const defaultBPM = 90;
// Tone.Transport.loop = true;
const sampler = new Tone.Sampler(getSoundFontInfo()).toDestination();
let started = false;
let playMetronome = false;

function sixteenthsFromDuration(x) {
  return {
    "1/8": 2,
    "1/4": 4,
    "1/2": 8,
    "1": 16
  }[x];
}

function sixteenthsToTime(x) {
  const bars = Math.floor(x / 16);
  const beats = Math.floor((x % 16) / 4);
  return `${bars}:${beats}:0`;
}

function parsePart(measures) {
  const flatMeasures = measures.reduce(
    (memo, item, measureIndex) => [
      ...memo,
      ...item.map((x, relativeIndex) => ({ ...x, measureIndex, relativeIndex }))
    ],
    []
  );
  let total = 0;
  const output = flatMeasures.reduce((memo, item) => {
    const newMemo = [
      ...memo,
      ...item.notes.map((x) => ({
        note: x,
        time: sixteenthsToTime(total),
        duration: item.duration,
        line: item.line,
        measureIndex: item.measureIndex,
        chordIndex: item.chordIndex,
        relativeIndex: item.relativeIndex
      }))
    ];
    total += sixteenthsFromDuration(item.duration);
    return newMemo;
  }, []);
  return output;
}

function measureFromTime(time) {
  return +time?.split(":")?.at(0) || 0;
}

function getTonePart({ part, loop, setCurrentInfo }) {
  const parsedPart = parsePart(part);
  const partLength = measureFromTime(parsedPart.at(-1)?.time) + 1;

  const tonePart = new Tone.Part((time, value) => {
    sampler.triggerAttackRelease(value.note, value.duration, time);
    Tone.Transport.scheduleOnce(() => {
      setCurrentInfo((prev) => {
        const notes = new Set(prev.notes);
        notes.delete(value.note);
        return {
          ...prev,
          notes: [...notes]
        };
      });
    }, ` +${value.duration}`);
    setCurrentInfo((prev) => {
      const notes = new Set(prev.notes);
      notes.add(value.note);
      return {
        line: value.line,
        measureIndex: value.measureIndex,
        chordIndex: value.chordIndex,
        relativeIndex: value.relativeIndex,
        notes: [...notes]
      };
    });
  }, parsedPart);

  tonePart.loop = loop;
  tonePart.loopEnd = `${partLength}m`;
  return tonePart;
}

export default function useTone({ part, bpm }) {
  const [isPlaying, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [currentInfo, setCurrentInfo] = useState({
    notes: [],
    line: -1,
    chordIndex: -1,
    measureIndex: -1,
    relativeIndex: -1
  });

  const partRef = useRef(null);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      return;
    }
    Tone.Transport.cancel();
    const metronome = new Tone.Loop((time) => {
      if (!playMetronome) {
        return;
      }
      sampler.triggerAttackRelease("C6", "32n", time);
    }, "4n").start(0);

    partRef.current = getTonePart({
      part,
      loop,
      setCurrentInfo
    });
  }, [part, loop, isPlaying]);

  async function toggle() {
    if (!started) {
      await Tone.start();
      started = true;
    }
    if (isPlaying) {
      Tone.Transport.pause();
    } else {
      partRef.current.start(0);
      Tone.Transport.toggle();
    }
    setPlaying((prev) => !prev);
  }

  function stop() {
    setPlaying(false);
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
    currentInfo
  };
}
