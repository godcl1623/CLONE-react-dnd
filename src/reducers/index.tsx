import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer } from './reducer';

export const doh = 'vah';

export const rootReducer = combineReducers({
  test: __TESTReducer
});

export type RootState = ReturnType<typeof rootReducer>;