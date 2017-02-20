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

describe('craps reducer', () => {
  describe('betting', () => {
    describe('player cant put more than max on a bet', () => {
      let nextState = crapsReducer(undefined, actions.betCome(505));

      it('doesnt allow the bet', () => {
        expect(getChips(nextState))
        .toEqual(1000);
        expect(getBets(nextState).come.line)
        .toEqual(0);
      })

    })

    describe('player bets 5 on come bet when in come out phase', () => {
      let state = crapsReducer(undefined, actions.betCome(5));

      it('doesnt allow bet', () => {
        expect(
             getBets(state).come.line).toEqual(0);
      })
    })

    describe('player bets 5 on come number odds when in come out phase', () => {
      let state = crapsReducer(undefined, actions.betComeOdds(4, 5));

      it('doesnt allow bet', () => {
        expect(getBets(state).come.odds[4]).toEqual(0);
      })
    })

    describe('player bets 5 on come number odds when they dont already have come bet on that number', () => {
      let state = crapsReducer(undefined, actions.roll(4, 2));
      state = crapsReducer(state, actions.betComeOdds(4, 5));
      it('doesnt allow bet', () => {
        expect(getBets(state).come.odds[4]).toEqual(0);
      })
    })

    describe('rolls a 4', () => {
      let state = crapsReducer(undefined, actions.roll(1, 3));

      describe('player bets 5 on come line', () => {
        state = crapsReducer(state, actions.betCome(5));

        let rolls = [{a: 1, b: 6}, {a: 6, b: 5}];

        _.map(rolls, roll => {
          let total = roll.a + roll.b;
          describe(total + ' is rolled', () => {
            let newState = crapsReducer(state, actions.roll(roll.a, roll.b));

            it('player wins back come bet', () => {
              expect(getChips(newState)).toEqual(1005);
            })

            it('chips cleared on come line', () => {
              expect(getBets(newState).come.line).toEqual(0);
            })
          })
        })

        describe('8 is rolled', () => {
          let newState = crapsReducer(state, actions.roll(4, 4));
          it('bet is moved to come bet on 8', () => {
            expect(getBets(newState).come.numbers[8]).toEqual(5);
          })

          describe('7 or 11 is rolled', () => {
            let newNewState = crapsReducer(newState, actions.roll(4, 3));
            it('player loses come bet', () => {
              expect(getBets(newNewState).come.numbers[8]).toEqual(0);
            })

            it('player has correct chips', () => {
              expect(getChips(newNewState)).toEqual(995);
            })
          })

          describe('player bets 5 on the 8 (not odds)', () => {
            let newNewState = crapsReducer(newState, actions.betComeNumber(8, 5));
            it('bets those chips', () => {
              expect(getBets(newNewState).come.numbers[8]).toEqual(10);
            })
          })

          describe('player bets 5 on 8 odds', () => {
            let newNewState = crapsReducer(newState, actions.betComeOdds(8, 5));

            it('bets those chips', () => {
              expect(getBets(newNewState).come.odds[8]).toEqual(5);
            })

            describe('8 is rolled', () => {
              let newNewNewState = crapsReducer(newNewState, actions.roll(2, 6));
              it('player wins correct chips based on odds', () => {
                expect(getChips(newNewNewState)).toEqual(1011);
              })
            })
          })

          describe('8 is rolled', () => {
            let newNewState = crapsReducer(newState, actions.roll(3, 5));

            it('player wins come bet', () => {
              expect(getChips(newNewState)).toEqual(1005);
            })

            it('chips cleared', () => {
              expect(getBets(newNewState).come.numbers[8]).toEqual(0);
            })
          })

          describe('4, 5, 6, 9, 10 is rolled', () => {
            let newNewState = crapsReducer(newState, actions.roll(4, 1));
            it('chips still on number 8', () => {
              expect(getChips(newNewState)).toEqual(995);
              expect(getBets(newNewState).come.numbers[8]).toEqual(5);
            })
          })
        })

        describe('2 3 or 12 is rolled', () => {
          let newState = crapsReducer(state, actions.roll(1, 1));

          it('chips cleared', () => {
            expect(getBets(newState).come.line).toEqual(0);
          })

          it('player has correct chips', () => {
            expect(getChips(newState)).toEqual(995);
          })
        })
      })
    });

    describe('player can remove odds', () => {
      let state = crapsReducer(undefined, actions.roll(1, 4));
      state = crapsReducer(state, actions.betCome(5));
      state = crapsReducer(state, actions.roll(2, 6));
      state = crapsReducer(state, actions.betComeOdds(8, 5));
      state = crapsReducer(state, actions.roll(1, 2));
      state = crapsReducer(state, actions.takeComeOdds(8));

      it('odds no longer on number', () => {
        expect(getBets(state).come.odds[8]).toEqual(0);
      })

      it('chips added back to player', () => {
        expect(getChips(state)).toEqual(995);
      })
    })

    describe('odds returned when 7 rolled in come out phase', () => {
      let state = crapsReducer(undefined, actions.roll(1, 4));
      state = crapsReducer(state, actions.betCome(5));
      state = crapsReducer(state, actions.roll(2, 6));
      state = crapsReducer(state, actions.betComeOdds(8, 10));
      state = crapsReducer(state, actions.roll(1, 4));
      state = crapsReducer(state, actions.roll(1, 6));

      it('chips on odds returned back to player', () => {
        expect(getChips(state)).toEqual(995);
      })
    })
  });
});
