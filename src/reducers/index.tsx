import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer, DragTargetReducer } from './reducer';

export const rootReducer = combineReducers({
  test: __TESTReducer,
  currentDragTarget: DragTargetReducer
});

export type RootState = ReturnType<typeof rootReducer>;