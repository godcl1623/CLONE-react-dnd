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
