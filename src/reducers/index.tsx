import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer, DragTargetReducer, DragCategoryReducer } from './reducer';

export const rootReducer = combineReducers({
  test: __TESTReducer,
  currentDragTarget: DragTargetReducer,
  currentDragCategory: DragCategoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;