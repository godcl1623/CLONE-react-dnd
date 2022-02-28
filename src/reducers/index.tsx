import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer, dragTargetReducer, dragCategoryReducer, dropTargetReducer, dropMapReducer, dropStateReducer, dropCategoryReducer } from './reducer';

export const rootReducer = combineReducers({
  test: __TESTReducer,
  currentDragTarget: dragTargetReducer,
  currentDragCategory: dragCategoryReducer,
  currentDropCategory: dropCategoryReducer,
  currentDropTarget: dropTargetReducer,
  dropMap: dropMapReducer,
  isDropped: dropStateReducer
});

export type RootState = ReturnType<typeof rootReducer>;