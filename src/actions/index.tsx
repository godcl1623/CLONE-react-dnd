import { BasicActionReturn } from '../components/CommonUtils';

type ActionReturn<T> = BasicActionReturn<T>;

export const __TEST__ = (any: any): ActionReturn<any> => ({
  type: '__TEST__',
  payload: any
});

export const __TEST2__ = (any: any): ActionReturn<any> => ({
  type: '__TEST2__',
  payload: any
});