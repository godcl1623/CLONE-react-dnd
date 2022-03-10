import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

export default function useGlobalStates() {
  const currentDragTarget = useSelector((state: RootState) => state.currentDragTarget);
  const currentDropTarget = useSelector((state: RootState) => state.currentDropTarget);
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const currentDropCategory = useSelector((state: RootState) => state.currentDropCategory);
  const dropMap = useSelector((state: RootState) => state.dropMap);
  const isDropped = useSelector((state: RootState) => state.isDropped);

  return {
    currentDragTarget,
    currentDropTarget,
    currentDragCategory,
    currentDropCategory,
    dropMap,
    isDropped
  };
}