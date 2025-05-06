import {combineReducers} from 'redux';
import user from './user';
import activityIndicator from './activityIndicator';

const rootReducer = combineReducers({
  auth: user,
  activityIndicator,
});

export default rootReducer;
