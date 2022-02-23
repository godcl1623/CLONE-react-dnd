import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers';

export default function Test() {
  const currentDragTarget = useSelector((state: RootState) => state.currentDragTarget);
  return (
    <div></div>
  )
}