import { useStore } from '../components/CommonUtils';

export default function useGlobalStates() {
  const {
    currentDropTarget,
    currentDragCategory,
    currentDropCategory,
    dropMap,
    isDropped
  } = useStore();

  return {
    currentDropTarget,
    currentDragCategory,
    currentDropCategory,
    dropMap,
    isDropped
  };
}