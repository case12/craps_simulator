import _ from 'lodash';

export const playerChipsPath = ['player', 'chips'];
export const passLinePath = ['player', 'bets', 'pass'];
export const comePath = ['player', 'bets', 'come', 'line'];
export const comeNumberPath = ['player', 'bets', 'come', 'numbers'];
export const comeOddsPath = ['player', 'bets', 'come', 'odds'];
export const dontPassPath = ['player', 'bets', 'dontPass'];

export function toConsole(state) {
  console.log(JSON.stringify(state.toJS()));
}

export function getChips(state) {
  return state.getIn(playerChipsPath)
}

export function addChips(state, chips) {
  return state.setIn(playerChipsPath, getChips(state) + chips);
}

export function reduceChips(state, chips) {
  return state.setIn(playerChipsPath, getChips(state) - chips);
}

export function getBet(state, indexer) {
  return state.getIn(indexer);
}

export function getComeNumberBet(state, number) {
  return state.getIn([...comeNumberPath, number]);
}

export function getComeOddsBet(state, number) {
  return state.getIn([...comeOddsPath, number]);
}

export function clearComeNumberAndOddsBet(state, number) {
  state = state.setIn([...comeNumberPath, number], 0);
  return state.setIn([...comeOddsPath, number], 0);
}

export function clear(state, indexer) {
  return state.setIn(indexer, 0);
}

export function clearCome(state) {
  return state.setIn(comePath, 0);
}

export function clearAllComeNumbers(state) {
  let numbers = [4, 5, 6, 8, 9, 10];
    // state = state.setIn([...comeNumberPath, 8], 0);
  _.map(numbers, number => {
    state = state.setIn([...comeNumberPath, number], 0);
  })
  return state;
}

export function clearAllComeOdds(state) {
  let numbers = [4, 5, 6, 8, 9, 10];
    // state = state.setIn([...comeNumberPath, 8], 0);
  _.map(numbers, number => {
    state = state.setIn([...comeOddsPath, number], 0);
  })
  return state;
}

export function isComeOutPhase(state) {
  return state.get('comeOut') === true;
}

export function addToCome(state, chips) {
  return state.setIn(comePath, getBet(state, comePath) + chips);
}

export function addToComeNumber(state, number, chips) {
  let indexer = [...comeNumberPath, number];
  return state.setIn(indexer, getBet(state, indexer) + chips);
}

export function addToComeOdds(state, number, chips) {
  let indexer = [...comeOddsPath, number];
  return state.setIn(indexer, getBet(state, indexer) + chips);
}

export function moveComeToNumber(state, number) {
  state = state.setIn([...comeNumberPath, number], getBet(state, comePath));
  return clear(state, comePath);
}
