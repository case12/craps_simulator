import { ROLL, BET_PASSLINE, BET_COME, BET_COMENUMBER, BET_COMEODDS, RESET, TAKE_COMEODDS } from '../constants';
import { fromJS } from 'immutable';
import _ from 'lodash';
import {evaluatePass} from '../bet_resolvers/pass_line.js'
import {evaluateCome} from '../bet_resolvers/come.js'
import * as CrapsState from '../bet_resolvers/state_helpers.js'

let ROLLS_INITIAL = {
  history: [],
};

export function rolls(state = fromJS(ROLLS_INITIAL), action = {}) {
  switch (action.type) {
  case RESET:
    return fromJS(ROLLS_INITIAL);
  case ROLL:
    return state.set("history", state.get("history").push(action.payload.dice));
  default:
    return state;
  }
}

let PLAYER_INITIAL = {
  chips: 1000,
  chipHistory: [1000],
  bets: {
    pass: 0,
    dontPass: 0,
    come: {
      line: 0,
      numbers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      odds: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
}

let CRAPS_INITIAL = {
  comeOut: true,
  point: 0,
  maxBet: 500,
  player: PLAYER_INITIAL
}

function evaluateRoll(state, die1, die2) {
  state = evaluatePass(state, die1, die2);
  state = evaluateCome(state, die1, die2);
  return state;
}

function updateChipHistory(state, chips) {
  var chipHistory = state.getIn(['player', 'chipHistory']).push(chips);
  return state.setIn(['player', 'chipHistory'], chipHistory);
}

export function craps(state = fromJS(CRAPS_INITIAL), action = {}) {
  switch (action.type) {
  case RESET:
    return fromJS(CRAPS_INITIAL);
  case ROLL:
    state = evaluateRoll(state, action.payload.dice.a, action.payload.dice.b);
    return updateChipHistory(state, CrapsState.getChips(state));
  case BET_PASSLINE:
    if (action.payload.bet > state.get('maxBet'))
      return state;
    state = state.setIn(CrapsState.playerChipsPath, state.getIn(CrapsState.playerChipsPath) - action.payload.bet);
    state = state.setIn(CrapsState.passLinePath, state.getIn(CrapsState.passLinePath) + action.payload.bet);
    return state;
  case BET_COME:
    if (action.payload.bet > state.get('maxBet'))
      return state;
    if (!CrapsState.isComeOutPhase(state)) {
      state = CrapsState.addToCome(state, action.payload.bet);
      state = CrapsState.reduceChips(state, action.payload.bet);
    }
    return state;
  case BET_COMEODDS:
    // bet on odds if already have bets on the number
    if (CrapsState.getComeNumberBet(state, action.payload.number, action.payload.bet) > 0) {
      state = CrapsState.addToComeOdds(state, action.payload.number, action.payload.bet);
      state = CrapsState.reduceChips(state, action.payload.bet);
    }
    // TODO: Dont surpase max allowed bet on odds
    return state;
  case BET_COMENUMBER:
    // bet on number if already have bets on the number
    if (CrapsState.getComeNumberBet(state, action.payload.number, action.payload.bet) > 0) {
      state = CrapsState.addToComeNumber(state, action.payload.number, action.payload.bet);
      state = CrapsState.reduceChips(state, action.payload.bet);
    }
    return state;
  case TAKE_COMEODDS:
    return CrapsState.returnComeOdds(state, action.payload.number);
  default:
    return state;
  }
}

