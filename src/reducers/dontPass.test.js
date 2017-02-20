import crapsReducer from './';
import * as actionTypes from '../constants';
import * as actions from '../actions';
import { fromJS, List, Map } from 'immutable';
import _ from 'lodash';
import { CRAPS_INITIAL, ROLLS_INITIAL, } from './craps'

let INITIAL_STATE = {
  rolls: ROLLS_INITIAL,
  craps: CRAPS_INITIAL
}


function getBets(state) {
  return state.craps.toJS().player.bets;
}

function getChips(state) {
  return state.craps.toJS().player.chips;
}

function getDontPassOddsPayout(oddsBet, point) {
  switch (point) {
  case 4:
  case 10:
    return oddsBet * 1 / 2;
  case 5:
  case 9:
    return oddsBet * 2 / 3;
  case 6:
  case 8:
    return oddsBet * 5 / 6;
  }
}

describe('betting - Dont Pass', () => {
  describe('player bets on dont pass', () => {
    let state = crapsReducer(undefined, actions.betDontPass(5));

    describe('7 or 11 is rolled', () => {
      _.map([{a: 4, b: 3}, {a: 6, b: 5}], (dice) => {
        let losingState = crapsReducer(state, actions.roll(dice.a, dice.b));
        it('player loses bet', () => {
          expect(getChips(losingState)).toEqual(995);
          expect(getBets(losingState).dontPass).toEqual(0);
        })
      })
    })

    describe('2 or 3 is rolled', () => {
      _.map([{a: 1, b: 1}, {a: 1, b: 2}], (dice) => {
        let winningState = crapsReducer(state, actions.roll(dice.a, dice.b));
        it('player wins bet', () => {
          expect(getChips(winningState)).toEqual(1005);
          expect(getBets(winningState).dontPass).toEqual(0);
        })
      })
    })

    describe('12 is rolled', () => {
      _.map([{a: 6, b: 6}], (dice) => {
        let tieState = crapsReducer(state, actions.roll(dice.a, dice.b));
        it('tie', () => {
          expect(getChips(tieState)).toEqual(1000);
          expect(getBets(tieState).dontPass).toEqual(0);
        })
      })
    })

    describe('point is rolled', () => {
      _.map([{a:3, b:1}, {a:3, b:2}, {a:3, b:3}, {a:3, b:5}, {a:3, b:6}, {a:5, b:5}], (dice) => {
        let pointState = crapsReducer(state, actions.roll(dice.a, dice.b));
        pointState = crapsReducer(pointState, actions.betDontPassOdds(10));

        describe('7 rolled before point ' + (dice.a + dice.b), () => {
          let winningState = crapsReducer(pointState, actions.roll(6, 1));
          it('player wins bets', () => {
            expect(getChips(winningState)).toEqual(1005 + getDontPassOddsPayout(10, dice.a + dice.b));
            expect(getBets(winningState).dontPass).toEqual(0);
          })
        })

        describe('point is rolled before 7', () => {
          let losingState = crapsReducer(pointState, actions.roll(dice.a, dice.b));
          it('player loses bets', () => {
            expect(getChips(losingState)).toEqual(985);
            expect(getBets(losingState).dontPass).toEqual(0);
          })
        })

        describe('anything but point ' + (dice.a + dice.b) + ' is rolled', () => {
          _.map([{a: 1, b: 1}, {a: 2, b: 1}, {a:3, b:1}, {a:3, b:2}, {a:3, b:3}, {a:3, b:5}, {a:3, b:6}, {a:5, b:5}, {a:6, b:5}, {a:6, b:6}], (tieDice) => {
            if (dice.a !== tieDice.a || dice.b !== tieDice.b) {
              let tieState = crapsReducer(pointState, actions.roll(tieDice.a, tieDice.b));
              it('ties on ' + (tieDice.a + tieDice.b), () => {
                expect(getChips(tieState)).toEqual(985);
                expect(getBets(tieState).dontPass).toEqual(5);
                expect(getBets(tieState).dontPassOdds).toEqual(10);
              })
            }
          })
        })
      })
    })
  })
});
