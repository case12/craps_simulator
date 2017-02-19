import _ from 'lodash';
import * as CrapsState from '../bet_resolvers/state_helpers.js'

function getOddsAward(state, number) {
  let bet = CrapsState.getComeOddsBet(state, number);
  switch (number) {
    case 4:
    case 10:
      return bet + bet * 2;
    case 5:
    case 9:
      return bet + bet * (3/2);
    case 6:
    case 8:
      return bet + bet * (6/5);
    default:
      return 0;
  }
}

export function evaluateCome(state, die1, die2) {
  let total = die1 + die2;

  switch (total) {
  case 4:
  case 5:
  case 6:
  case 8:
  case 9:
  case 10:
    // Award on come number
    state = CrapsState.addChips(state, CrapsState.getComeNumberBet(state, total) * 2);
    state = CrapsState.addChips(state, getOddsAward(state, total));
    state = CrapsState.clearComeNumberAndOddsBet(state, total);
    return CrapsState.moveComeToNumber(state, total);
  case 7:
  case 11:
    // Clear come Numbers
    if (total === 7) {
      state = CrapsState.clearAllComeNumbers(state);
      state = CrapsState.clearAllComeOdds(state);
    }
    // Win come bet
    state = CrapsState.addChips(state, CrapsState.getBet(state, CrapsState.comePath) * 2);
    state = CrapsState.clear(state, CrapsState.comePath);
    return state;
  case 2:
  case 3:
  case 12:
    // Clearn come bet
    return CrapsState.clearCome(state);
  default:
    return state;
  }
}
