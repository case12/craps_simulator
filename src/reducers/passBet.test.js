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

describe('craps reducer', () => {
  it('should return the initial state', () => {
    expect(
      crapsReducer(undefined, {}).rolls.toJS()
    ).toEqual(INITIAL_STATE.rolls);

    expect(
      crapsReducer(undefined, {}).craps.toJS()
    ).toEqual(INITIAL_STATE.craps);
  });

  it('should add a roll to the history', () => {
      let nextHistory = [{a: 3, b: 2}];
      let nextState = crapsReducer(undefined, actions.roll(3, 2));
      expect(
        nextState.rolls.toJS().history
      ).toEqual(nextHistory);

      let nextNextHistory = [{a: 3, b: 2}, {a: 1, b: 5}];
      let nextNextState =  crapsReducer(nextState, actions.roll(1, 5));
      expect(
       nextNextState.rolls.toJS().history
      ).toEqual(nextNextHistory);
  });

  describe('roll', () => {
    describe('when in come out phase', () => {
      describe('and roll is 2, 3, 7, 11, 12', () => {
        it('state remains in come out', () => {
          let nextState = crapsReducer(undefined, actions.roll(1, 1));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);

          nextState = crapsReducer(undefined, actions.roll(1, 2));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);

          nextState = crapsReducer(undefined, actions.roll(1, 6));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);

          nextState = crapsReducer(undefined, actions.roll(6, 5));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);

          nextState = crapsReducer(undefined, actions.roll(6, 6));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);
        });
      });

      describe('and roll is 4, 5, 6, 8, 9, 10', () => {
        it('state goes to point phase', () => {
          let nextState = crapsReducer(undefined, actions.roll(1, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(undefined, actions.roll(2, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(undefined, actions.roll(3, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(undefined, actions.roll(3, 5));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(undefined, actions.roll(6, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(undefined, actions.roll(6, 4));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);
        });
      });

    });

    describe('when in point phase - point 5', () => {
      let state = crapsReducer(undefined, actions.roll(3, 2));
      describe('and roll is 7', () => {
        it('state goes back to come out', () => {
          let nextState = crapsReducer(state, actions.roll(3, 4));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);
        });
      });


      describe('and roll is 5', () => {
        it('state goes back to come out', () => {
          let nextState = crapsReducer(state, actions.roll(3, 2));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(true);

          expect(nextState.craps.toJS().point)
          .toEqual(0);
        });
      });

      describe('and roll is 2, 3, 4, 6, 8, 9, 10, 11, 12', () => {
        it('state stays in point phase if not point roll', () => {
          let nextState = crapsReducer(state, actions.roll(1, 1));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(1, 2));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(1, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(3, 3));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(4, 4));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(4, 5));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(6, 4));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(6, 5));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);

          nextState = crapsReducer(state, actions.roll(6, 6));
          expect(nextState.craps.toJS().comeOut)
          .toEqual(false);
        });
      });
    });
  });

  describe('betting', () => {
    describe('player cant put more than max on a bet', () => {
      let nextState = crapsReducer(undefined, actions.betPassLine(505));

      it('doesnt allow the bet', () => {
        expect(nextState.craps.toJS().player.chips)
        .toEqual(1000);
        expect(nextState.craps.toJS().player.bets.pass)
        .toEqual(0);
      })

    })
    describe('player bets 5 on pass line', () => {
      let nextState = crapsReducer(undefined, actions.betPassLine(5));

      it('5 chips are removed and put on pass line', () => {
        expect(nextState.craps.toJS().player.chips)
        .toEqual(995);

        expect(nextState.craps.toJS().player.bets.pass)
        .toEqual(5);
      });

      describe('rolls a 7 or 11', () => {
        it('wins back their bet at 1:1', () => {
          let nextState = crapsReducer(undefined, actions.betPassLine(5));
          let nextState2 = crapsReducer(nextState, actions.roll(1, 6));
          expect(
           nextState2.craps.toJS().player.chips)
          .toEqual(1005);

          expect(
           nextState2.craps.toJS().player.bets.pass)
          .toEqual(0);

        });
      });

      describe('rolls a 2, 3, 12', () => {
        it('loses their bet', () => {
          let nextState = crapsReducer(undefined, actions.betPassLine(5));
          nextState = crapsReducer(nextState, actions.roll(1, 1));
          expect(
           nextState.craps.toJS().player.chips)
          .toEqual(995);

          expect(
           nextState.craps.toJS().player.bets.pass)
          .toEqual(0);
        });
      });

      describe('rolls a 4', () => {


        describe('then rolls a 2, 3, 5, 6, 8, 9, 10, 11, 12', () => {
          it('still in point phase', () => {
            let nextState = crapsReducer(undefined, actions.betPassLine(5));
            nextState = crapsReducer(nextState, actions.roll(1, 3));
            nextState = crapsReducer(nextState, actions.roll(2, 6));
            expect(
             nextState.craps.toJS().player.chips)
            .toEqual(995);

            expect(
             nextState.craps.toJS().player.bets.pass)
            .toEqual(5);

            expect(
             nextState.craps.toJS().comeOut)
            .toEqual(false);
          });
        });

        describe('then rolls a 4', () => {

          let nextState = crapsReducer(undefined, actions.betPassLine(5));
          nextState = crapsReducer(nextState, actions.roll(1, 3));
          nextState = crapsReducer(nextState, actions.roll(3, 1));

          it('goes to come out phase', () => {
            expect(
             nextState.craps.toJS().comeOut)
            .toEqual(true);
          });
          it('player wins bet', () => {
            expect(
             nextState.craps.toJS().player.chips)
            .toEqual(1005);

            expect(
             nextState.craps.toJS().player.bets.pass)
            .toEqual(0);
          });
        });

        describe('then rolls a 7', () => {

          let nextState = crapsReducer(undefined, actions.betPassLine(5));
          nextState = crapsReducer(nextState, actions.roll(1, 3));
          nextState = crapsReducer(nextState, actions.roll(3, 4));

          it('goes to come out phase', () => {
            nextState = crapsReducer(nextState, actions.roll(4, 3));
            expect(
             nextState.craps.toJS().comeOut)
            .toEqual(true);
          });

          it('player loses bet', () => {
            nextState = crapsReducer(nextState, actions.roll(4, 3));
            expect(
             nextState.craps.toJS().player.chips)
            .toEqual(995);

            expect(
             nextState.craps.toJS().player.bets.pass)
            .toEqual(0);
          });
        });
      });
    });
  });
});
