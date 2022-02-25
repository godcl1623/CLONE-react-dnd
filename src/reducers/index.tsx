import { combineReducers } from '@reduxjs/toolkit';
import { __TESTReducer, DragTargetReducer, DragCategoryReducer, DropTargetReducer, DropMapReducer } from './reducer';

export const rootReducer = combineReducers({
  test: __TESTReducer,
  currentDragTarget: DragTargetReducer,
  currentDragCategory: DragCategoryReducer,
  currentDropTarget: DropTargetReducer,
  dropMap: DropMapReducer
});

export type RootState = ReturnType<typeof rootReducer>;