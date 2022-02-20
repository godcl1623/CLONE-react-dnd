import { ReturnAction } from '../actions';

export const __TESTReducer = (state: any = 'test', action: any) => {
  if (action.type === '__TEST__') {
    return action.payload;
  }
  return state;
};

export const DragTargetReducer = (state: HTMLElement | null = null, action: ReturnAction<HTMLElement>) => {
  if (action.type === 'CURRENT_DRAG_IS') {
    return action.payload;
  }
  return state;
};
