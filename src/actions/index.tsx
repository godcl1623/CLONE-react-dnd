import { BasicActionCreator } from '../components/CommonUtils';

export type ReturnAction<T> = BasicActionCreator<T>;

export const __TESTAction__ = (any: any) => ({
  type: '__TEST__',
  payload: any,
});

export const setCurrentDragTarget = (dragTarget: HTMLElement): ReturnAction<HTMLElement> => ({
  type: 'CURRENT_DRAG_IS',
  payload: dragTarget,
});

export const updateDragCategory = (category: string): ReturnAction<string> => ({
  type: 'CURRENT_DRAG_CATEGORY_IS',
  payload: category
})

export const updateDropCategory = (category: string): ReturnAction<string> => ({
  type: 'CURRENT_DROP_CATEGORY_IS',
  payload: category
})