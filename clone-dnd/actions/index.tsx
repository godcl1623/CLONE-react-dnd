import { BasicActionCreator, Structure } from '../components/CommonUtils';

export type ReturnAction<T> = BasicActionCreator<T>;

export const __TESTAction__ = (any: any) => ({
  type: '__TEST__',
  payload: any,
});

export const setCurrentDragTarget = (dragTarget: HTMLElement | null = null): ReturnAction<HTMLElement | null> => ({
  type: 'CURRENT_DRAG_IS',
  payload: dragTarget,
});

export const updateDragCategory = (category: string): ReturnAction<string> => ({
  type: 'CURRENT_DRAG_CATEGORY_IS',
  payload: category
});

export const updateDropCategory = (category: string): ReturnAction<string> => ({
  type: 'CURRENT_DROP_CATEGORY_IS',
  payload: category
});

export const setCurrentDropTarget = (dropTarget: HTMLElement | null): ReturnAction<HTMLElement | null> => ({
  type: 'CURRENT_DROP_IS',
  payload: dropTarget,
});

export const updateDropMap = (dropMap: Structure): ReturnAction<Structure> => ({
  type: 'UPDATE_DROP_MAP',
  payload: dropMap
});

export const updateDropState = (dropState: boolean): ReturnAction<boolean> => ({
  type: 'IS_DROP_HAPPENED',
  payload: dropState
})