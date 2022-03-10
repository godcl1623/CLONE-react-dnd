import { ReturnAction } from '../actions';
import { Structure } from '../components/CommonUtils';

export const dragTargetReducer = (state: HTMLElement | null = null, action: ReturnAction<HTMLElement>) => {
  if (action.type === 'CURRENT_DRAG_IS') {
    return action.payload;
  }
  return state;
};

export const dragCategoryReducer = (state: string | null = null, action: ReturnAction<string>) => {
  if (action.type === 'CURRENT_DRAG_CATEGORY_IS') {
    return action.payload;
  }
  return state;
};

export const dropCategoryReducer = (state: string | null = null, action: ReturnAction<string>) => {
  if (action.type === 'CURRENT_DROP_CATEGORY_IS') {
    return action.payload;
  }
  return state;
};

export const dropTargetReducer = (state: HTMLElement | null = null, action: ReturnAction<HTMLElement | null>) => {
  if (action.type === 'CURRENT_DROP_IS') {
    return action.payload;
  }
  return state;
};

export const dropMapReducer = (state: Structure | null = null, action: ReturnAction<Structure>) => {
  if (action.type === 'UPDATE_DROP_MAP') {
    return action.payload;
  }
  return state;
};

export const dropStateReducer = (state: boolean = false, action: ReturnAction<boolean>) => {
  if (action.type === 'IS_DROP_HAPPENED') {
    return action.payload;
  }
  return state;
};