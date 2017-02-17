import * as actionTypes from '../constants';

export function roll(a, b) {
  return {
    type: actionTypes.ROLL,
    payload: {dice: {a, b} }
  };
}

export function betPassLine(bet) {
  return {
    type: actionTypes.BET_PASSLINE,
    payload: {bet}
  };
}
