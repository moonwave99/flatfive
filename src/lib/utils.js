function getMeasureLengthFromMeter(meter) {
  return {
    '4/4': 1,
    '3/4': 0.75,
  }[meter];
}

function sixteenthsFromDuration(x, measureLength) {
  return {
    '1/8': 2,
    '1/4': 4,
    '1/2': 8,
    1: 16 * measureLength,
  }[x];
}

function sixteenthsToTime(x, measureLength) {
  const bars = Math.floor(x / (16 * measureLength));
  const beats = Math.floor((x % (16 * measureLength)) / 4);
  return `${bars}:${beats}:0`;
}

function getDuration(x, measureLength) {
  const duration = frac(x);
  if (duration == 1) {
    return measureLength;
  }
  return duration;
}

export function addIndexesToChords(chords, meter) {
  const measureLength = getMeasureLengthFromMeter(meter);
  let total = 0;
  let time = 0;
  let measure = 0;
  let relativeIndex = 0;

  return chords.map((item, absoluteIndex) => {
    const duration = getDuration(item.duration, measureLength);
    total += duration;

    if (total > measureLength) {
      measure++;
      relativeIndex = 0;
      total = duration;
    }
    const output = {
      ...item,
      duration: duration == measureLength ? meter : item.duration,
      time: sixteenthsToTime(time, measureLength),
      measure,
      absoluteIndex,
      relativeIndex,
    };

    relativeIndex++;
    time += sixteenthsFromDuration(item.duration, measureLength);
    return output;
  });
}

const abcMap = {
  '1/16': 1,
  '1/8': 2,
  '1/4': 4,
  '1/2': 8,
  '3/4': 12,
  '4/4': 16,
};

export function fractionToAbc(x) {
  return abcMap[x];
}

export function frac(x) {
  if (+x === 1) {
    return 1;
  }
  try {
    const [num, den] = x.split('/');
    return num / den;
  } catch (error) {
    throw new Error(`${x} is not a computable fraction`);
  }
}

export function getTimeSignatureFromMeter(meter = '4/4') {
  try {
    return meter.split('/');
  } catch (error) {
    throw new Error(`${x} is not a computable fraction`);
  }
}

export function encodeSketch(sketch) {
  return window.btoa(unescape(encodeURIComponent(sketch)));
}

export function decodeSketch(encodedSketch) {
  return decodeURIComponent(escape(window.atob(encodedSketch)));
}
