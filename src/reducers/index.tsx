import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer, DragTargetReducer, DragCategoryReducer, DropTargetReducer } from './reducer';

export const rootReducer = combineReducers({
  test: __TESTReducer,
  currentDragTarget: DragTargetReducer,
  currentDragCategory: DragCategoryReducer,
  currentDropTarget: DropTargetReducer
});

export type RootState = ReturnType<typeof rootReducer>;