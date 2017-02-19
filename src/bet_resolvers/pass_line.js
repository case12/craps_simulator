import _ from 'lodash';
import {clear, addChips, getBet} from './state_helpers.js'
import * as CrapsState from '../bet_resolvers/state_helpers.js'

export function evaluatePass(state, die1, die2) {
  let total = die1 + die2;

  if (state.get("comeOut") === true) {
    switch (total) {
    case 4:
    case 5:
    case 6:
    case 8:
    case 9:
    case 10:
      state = state.set("comeOut", false);
      return state.set("point", total);
    case 7:
    case 11:
      if (total === 7) {
        let comeNumbers = [4, 5, 6, 8, 9, 10];
        _.forEach(comeNumbers, (number) => {
          state = CrapsState.returnComeOdds(state, number)
        })
      }
      state = addChips(state, getBet(state, CrapsState.passLinePath) * 2);
      state = clear(state, CrapsState.passLinePath);
      return state;
    case 2:
    case 3:
    case 12:
      state = clear(state, CrapsState.passLinePath);
      return state;
    default:
      return state;
    }
  }
  else {
    if (total === state.get("point")) {
      state = addChips(state, getBet(state, CrapsState.passLinePath) * 2);
      state = clear(state, CrapsState.passLinePath);
      state = clear(state, CrapsState.pointPath);
      return state.set("comeOut", true)
    }

    switch (total) {
    case 7:
      state = clear(state, CrapsState.passLinePath);
      state = clear(state, CrapsState.pointPath);
      return state.set("comeOut", true);
    default:
      return state;
    }
  }
}
