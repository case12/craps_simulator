import { ROLL, BET_PASSLINE } from '../constants';
import { fromJS, List, Map } from 'immutable';
import _ from 'lodash';

let INITIAL_STATE = {
  history: [],
};

export function rolls(state = fromJS(INITIAL_STATE), action = {}) {
  switch (action.type) {
  case ROLL:
    return state.set("history", state.get("history").push(action.payload.dice));
  default:
    return state;
  }
}

let PLAYER_INITIAL = {
  chips: 1000,
  bets: {
    pass: 0,
    dontPass: 0,
  }
}

let CRAPS_INITIAL = {
  comeOut: true,
  point: 0,
  player: PLAYER_INITIAL
}

let passBetIndexer = ['player', 'bets', 'pass'];
let dontPassBetIndexer = ['player', 'bets', 'dontPass'];

function toConsole(state) {
  console.log(JSON.stringify(state.toJS()));
}

function getChips(state) {
  return state.getIn(['player', 'chips'])
}

function getBet(state, indexer) {
  return state.getIn(indexer);
}

function addChips(state, chips) {
  let chipsAccess = ['player', 'chips'];
  return state.setIn(chipsAccess, getChips(state) + chips);
}

function clear(state, indexer) {
  return state.setIn(indexer, 0);
}

function evaluateRoll(state, die1, die2) {
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
      state = addChips(state, getBet(state, passBetIndexer) * 2);
      state = clear(state, passBetIndexer);
      return state;
    case 2:
    case 3:
    case 12:
      state = clear(state, passBetIndexer);
    default:
      return state;
    }
  }
  else {
    if (total == state.get("point")) {
      state = addChips(state, getBet(state, passBetIndexer) * 2);
      state = clear(state, passBetIndexer);
      return state.set("comeOut", true)
    }

    switch (total) {
    case 7:
      state = clear(state, passBetIndexer);
      return state.set("comeOut", true);
    default:
      return state;
    }
  }
}

export function craps(state = fromJS(CRAPS_INITIAL), action = {}) {
  switch (action.type) {
  case ROLL:
    return evaluateRoll(state, action.payload.dice.a, action.payload.dice.b);
  case BET_PASSLINE:
    let playerChips = ['player', 'chips'];
    let passline = ['player', 'bets', 'pass'];

    state = state.setIn(playerChips, state.getIn(playerChips) - action.payload.bet);
    state = state.setIn(passline, state.getIn(passline) + action.payload.bet);
    return state;
  default:
    return state;
  }
}

