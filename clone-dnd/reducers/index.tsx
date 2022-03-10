import { combineReducers } from '@reduxjs/toolkit';
import { dragTargetReducer, dragCategoryReducer, dropTargetReducer, dropMapReducer, dropStateReducer, dropCategoryReducer } from './reducer';

export const rootReducer = combineReducers({
  currentDragTarget: dragTargetReducer,
  currentDragCategory: dragCategoryReducer,
  currentDropCategory: dropCategoryReducer,
  currentDropTarget: dropTargetReducer,
  dropMap: dropMapReducer,
  isDropped: dropStateReducer
});

export type RootState = ReturnType<typeof rootReducer>;