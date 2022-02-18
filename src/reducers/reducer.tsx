export const bar = 'foo';

export const __TESTReducer = (state: any = 'test', action: any) => {
  if (action.type === '__TEST__') {
    return action.payload;
  }
  return state;
}