import { useStore } from '../components/CommonUtils';

export default function useGlobalStates() {
  const {
    currentDragTarget,
    currentDropTarget,
    currentDragCategory,
    currentDropCategory,
    dropMap,
    isDropped
  } = useStore();

  return {
    currentDragTarget,
    currentDropTarget,
    currentDragCategory,
    currentDropCategory,
    dropMap,
    isDropped
  };
}