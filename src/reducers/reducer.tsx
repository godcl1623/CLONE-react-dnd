import { BasicActionReturn } from '../components/CommonUtils';

type ActionReturn<T> = BasicActionReturn<T>;

function __TESTReducer(action: ActionReturn<any>, defaultState: any = null): any {
  if (action.type === '__TEST__') {
    return action.payload;
  }
  return defaultState;
}

function __TESTReducer2(action: ActionReturn<any>, defaultState: any = null): any {
  if (action.type === '__TEST__') {
    return action.payload;
  }
  return defaultState;
}

const reducers = {
  __TESTReducer,
  __TESTReducer2
}

export default reducers;