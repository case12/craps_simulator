import { rolls, craps } from './craps';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  rolls,
  craps,
});

export default rootReducer;
