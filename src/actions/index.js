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

export function betCome(bet) {
  return {
    type: actionTypes.BET_COME,
    payload: {bet}
  };
}

export function betComeOdds(number, bet) {
  return {
    type: actionTypes.BET_COMEODDS,
    payload: {number, bet}
  };
}

export function betComeNumber(number, bet) {
  return {
    type: actionTypes.BET_COMENUMBER,
    payload: {number, bet}
  };
}

export function reset() {
  return {
    type: actionTypes.RESET,
  };
}

export function takeComeOdds(number) {
  return {
    type: actionTypes.TAKE_COMEODDS,
    payload: {number}
  };
}

export function betDontPass(bet) {
  return {
    type: actionTypes.BET_DONTPASS,
    payload: {bet}
  };
}

export function betDontPassOdds(bet) {
  return {
    type: actionTypes.BET_DONTPASSODDS,
    payload: {bet}
  };
}
