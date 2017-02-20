import _ from 'lodash';
import {clear, addChips, getBet} from './state_helpers.js'
import * as CrapsState from '../bet_resolvers/state_helpers.js'

function getOddsAward(state, number) {
  let bet = CrapsState.getDontPassOddsBet(state, number);
  switch (number) {
    case 4:
    case 10:
      return bet + bet * 1 / 2;
    case 5:
    case 9:
      return bet + bet * 2 / 3;
    case 6:
    case 8:
      return bet + bet * 5 / 6;
    default:
      return 0;
  }
}

export function evaluateDontPass(state, die1, die2) {
  let total = die1 + die2;
  if (state.get("comeOut") === true) {
    switch (total) {
    case 7:
    case 11:
      state = CrapsState.clearDontPassBets(state);
      return state;
    case 2:
    case 3:
      state = addChips(state, getBet(state, CrapsState.dontPassPath) * 2);
      state = CrapsState.clearDontPassBets(state);
      return state;
    case 12:
      state = addChips(state, getBet(state, CrapsState.dontPassPath));
      state = CrapsState.clearDontPassBets(state);
      return state;
    default:
      return state;
    }
  }
  else {
    let point = CrapsState.getPoint(state);
    if (total === point) {
      state = CrapsState.clearDontPassBets(state);
      return state;
    }
    else if (total === 7) {
      state = addChips(state, getBet(state, CrapsState.dontPassPath) * 2 + getOddsAward(state, point));
      state = CrapsState.clearDontPassBets(state);
      return state;
    }
  }
  return state;
}
