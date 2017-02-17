import craps from '../reducers';
import * as actions from '../actions';
import * as actionTypes from '../constants';

describe('actions', () => {
  it('should create an action to roll the dice', () => {
    const message = {dice: {a: 1, b: 3}}
    const expectedAction = {
      type: actionTypes.ROLL,
      payload: message
    }
    expect(actions.roll(1, 3)).toEqual(expectedAction)
  })

  it('should create an action to bet on pass line', () => {
    const message = {dice: {a: 1, b: 3}}
    const expectedAction = {
      type: actionTypes.BET_PASSLINE,
      payload: {bet: 5}
    }
    expect(actions.betPassLine(5)).toEqual(expectedAction)
  })
})
