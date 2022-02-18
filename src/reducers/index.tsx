import { combineReducers } from 'redux';
import reducers from './reducer';

export default combineReducers({
  __TEST__: reducers.__TESTReducer,
  __TEST2__: reducers.__TESTReducer2
})