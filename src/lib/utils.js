function sixteenthsFromDuration(x) {
  return {
    '1/8': 2,
    '1/4': 4,
    '1/2': 8,
    1: 16,
  }[x];
}

function sixteenthsToTime(x) {
  const bars = Math.floor(x / 16);
  const beats = Math.floor((x % 16) / 4);
  return `${bars}:${beats}:0`;
}

export function addIndexes(part) {
  let total = 0;
  let time = 0;
  let measure = 0;
  let relativeIndex = 0;
  return part.map((item, absoluteIndex) => {
    const duration = frac(item.duration);
    total += duration;
    if (total > 1) {
      measure++;
      relativeIndex = 0;
      total = duration;
    }
    const output = {
      ...item,
      time: sixteenthsToTime(time),
      measure,
      absoluteIndex,
      relativeIndex,
    };

    relativeIndex++;
    time += sixteenthsFromDuration(item.duration);
    return output;
  });
}

export function fractionToAbc(x) {
  return {
    '1/8': 8,
    '1/4': 4,
    '1/2': 2,
    1: 1,
  }[x];
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

export function fractionToSixteenths(x) {
  return {
    '1/8': 2,
    '1/4': 4,
    '1/2': 8,
    1: 16,
  }[x];
}
