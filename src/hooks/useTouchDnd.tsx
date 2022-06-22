import React, { useRef } from 'react';

const cloneTgtStyleKeys = ['width', 'height', 'position', 'left', 'top', 'opacity', 'background'] as const;
const highlightStylesKeys = ['transition', 'currEleBoxShadow', 'dropTgtBoxShadow', 'exceptionsBoxShadow'] as const;

type CoordsObject = Record<string, number>;

type MoveResIdxs = {
  originalLists: (HTMLElement | null)[];
  insertCrit: number;
  tgtIdx: number;
  direction: string;
};

type OrigCloneTgtStyle = {
  [key in typeof cloneTgtStyleKeys[number] | string]?: string;
}

type OrigHighlightStyles = {
  [key in typeof highlightStylesKeys[number]]?: string;
}

export interface ITouchStyleOptions {
  cloneTgtStyle?: OrigCloneTgtStyle;
  highlightStyles?: OrigHighlightStyles;
}

const returnMoveRes = (moveResIdxs: MoveResIdxs): string[] => {
  const { originalLists, insertCrit, tgtIdx, direction } = moveResIdxs;
  const front = originalLists.slice(0, insertCrit);
  const back = originalLists.slice(insertCrit);
  const moveItem =
    direction === 'down'
      ? front.splice(front.indexOf(originalLists[tgtIdx]), 1)[0]
      : back.splice(back.indexOf(originalLists[tgtIdx]), 1)[0];
  back.unshift(moveItem);
  return [...front, ...back].map(ele => (ele as HTMLElement).classList[1]);
};

export default function useTouchDnd(styleOptions?: ITouchStyleOptions): any[] {
  const originalTouchElement = useRef<HTMLElement | null>(null);
  const clonedElement = useRef<HTMLElement | null>(null);
  const originalCSS = useRef<CSSStyleDeclaration | null>(null);
  const originalTopCoord = useRef<number>(0);
  const originalProcCoords = useRef<CoordsObject>({});
  const endTopCoord = useRef<number>(0);
  const fooRef = useRef<number[] | null>(null);

  const sumAfterParse = (...args: string[]): any => {
    return args
      .map((size: string) => parseInt(size, 10))
      .reduce((init: number, add: number) => init + add, 0);
  };

  const makeTouchTgtClone = (
    touchEvt: React.TouchEvent,
    touchTgt: HTMLElement,
    dropTgt: HTMLElement
  ): void => {
    originalTouchElement.current = touchTgt;
    const originalStyles = originalTouchElement.current.children[0].getBoundingClientRect();
    originalCSS.current = window.getComputedStyle(originalTouchElement.current);
    const { left, top, height, width } = originalStyles;
    const { marginTop, marginBottom, background } = originalCSS.current;
    const { height: h } = window.getComputedStyle(originalTouchElement.current.children[0]);
    const { clientX: tLeft, clientY: tTop } = touchEvt.touches[0];
    const cloneTgt = originalTouchElement.current.cloneNode(true) as HTMLElement;
    const origStyleVals = [width, height, 'absolute', left, top, '0.5', background];
    const origStyleUnits = ['px', 'px', '', 'px', 'px', '', ''];
    if (
      styleOptions &&
      styleOptions.cloneTgtStyle &&
      Object.values(styleOptions.cloneTgtStyle).length !== 0
    ) {
      cloneTgtStyleKeys.forEach((key: string, idx: number) => {
        cloneTgt.style[key as any] = styleOptions.cloneTgtStyle![key]
          ? styleOptions.cloneTgtStyle![key] as string
          : origStyleVals[idx] + origStyleUnits[idx];
      })
    } else {
      cloneTgtStyleKeys.forEach((key: string, idx: number) => {
        cloneTgt.style[key as any] = origStyleVals[idx] + origStyleUnits[idx];
      })
    }
    clonedElement.current = cloneTgt;
    originalTopCoord.current = tTop;
    endTopCoord.current = tTop;
    originalProcCoords.current.top = tTop - top;
    originalProcCoords.current.left = tLeft - left;
    fooRef.current = [sumAfterParse(marginTop, marginBottom, h)];
    dropTgt.appendChild(cloneTgt);
  };

  const trackClonedTgt = (touchEvt: React.TouchEvent): void => {
    const moveTgt: HTMLElement | null = clonedElement.current as HTMLElement;
    const left: number = touchEvt.touches[0].clientX;
    const top: number = touchEvt.touches[0].clientY;
    moveTgt.style.left = left - originalProcCoords.current.left + 'px';
    moveTgt.style.top = top - originalProcCoords.current.top + 'px';
    endTopCoord.current = top;
  };

  const highlightDragItem = (touchEvt: React.TouchEvent, dropTgt: HTMLElement): void => {
    const draggableTgtLists = Array.from(dropTgt.children).slice(0, dropTgt.children.length - 1);
    const top: number = touchEvt.touches[0].clientY;
    const crit = originalTopCoord.current - top;
    const currIdx = draggableTgtLists.indexOf(originalTouchElement.current as HTMLElement);
    const styleConditions =
      styleOptions &&
      styleOptions.highlightStyles &&
      Object.values(styleOptions.highlightStyles).length !== 0;
    if (crit > 0) {
      const movedDistanceToIdx =
        Math.floor(crit / fooRef.current![0]) >= draggableTgtLists.length
          ? draggableTgtLists.length - 1
          : Math.floor(crit / fooRef.current![0]);
      draggableTgtLists
        .slice(0, currIdx + 1)
        .reverse()
        .forEach((currEle, idx) => {
          (currEle as HTMLElement).style.transition = styleConditions
            ? styleOptions.highlightStyles!.transition
              ? styleOptions.highlightStyles!.transition as string
              : 'box-shadow 0.3s'
            : 'box-shadow 0.3s';
          if (idx === movedDistanceToIdx) {
            (currEle as HTMLElement).style.boxShadow = styleConditions
              ? styleOptions.highlightStyles!.currEleBoxShadow
                ? styleOptions.highlightStyles!.currEleBoxShadow as string
                : '0 0 20px 5px skyblue'
              : '0 0 20px 5px skyblue';
            (dropTgt.children[0] as HTMLElement).style.boxShadow = styleConditions
              ? styleOptions.highlightStyles!.dropTgtBoxShadow
                ? styleOptions.highlightStyles!.dropTgtBoxShadow as string
                : '0 0 20px 5px skyblue'
              : '0 0 20px 5px skyblue';
          } else {
            (currEle as HTMLElement).style.boxShadow = styleConditions
              ? styleOptions.highlightStyles!.exceptionsBoxShadow
                ? styleOptions.highlightStyles!.exceptionsBoxShadow as string
                : 'none'
              : 'none';
          }
        });
    } else if (crit < 0) {
      const movedDistanceToIdx =
        Math.floor((crit * -1) / fooRef.current![0]) >= draggableTgtLists.length
          ? draggableTgtLists.length - 1
          : Math.floor((crit * -1) / fooRef.current![0]);
      draggableTgtLists.slice(currIdx).forEach((currEle, idx) => {
        (currEle as HTMLElement).style.transition = styleConditions
          ? styleOptions.highlightStyles!.transition
            ? styleOptions.highlightStyles!.transition as string
            : 'box-shadow 0.3s'
          : 'box-shadow 0.3s';
        if (idx === movedDistanceToIdx) {
          (currEle as HTMLElement).style.boxShadow = styleConditions
            ? styleOptions.highlightStyles!.currEleBoxShadow
              ? styleOptions.highlightStyles!.currEleBoxShadow as string
              : '0 0 20px 5px skyblue'
            : '0 0 20px 5px skyblue';
          (dropTgt.children[dropTgt.children.length - 1] as HTMLElement).style.boxShadow =
            styleConditions
              ? styleOptions.highlightStyles!.dropTgtBoxShadow
                ? styleOptions.highlightStyles!.dropTgtBoxShadow as string
                : '0 0 20px 5px skyblue'
              : '0 0 20px 5px skyblue';
        } else {
          (currEle as HTMLElement).style.boxShadow = styleConditions
            ? styleOptions.highlightStyles!.exceptionsBoxShadow
              ? styleOptions.highlightStyles!.exceptionsBoxShadow as string
              : 'none'
            : 'none';
        }
      });
    }
  };

  const detectDropEvt = (dropTgt: HTMLElement, updateStateFuncs: ((param: string[]) => void)): void => {
    clonedElement.current!.remove();
    clonedElement.current = null;
    const originalLists: (HTMLElement | null)[] = Array.from(dropTgt.children) as HTMLElement[];
    const styleConditions =
      styleOptions &&
      styleOptions.highlightStyles &&
      Object.values(styleOptions.highlightStyles).length !== 0;
    originalLists.forEach(ele => {
      ele!.style.boxShadow = styleConditions
        ? styleOptions.highlightStyles!.exceptionsBoxShadow
          ? styleOptions.highlightStyles!.exceptionsBoxShadow as string
          : 'none'
        : 'none';
    });
    const tgtIdx: number = originalLists.indexOf(originalTouchElement.current);
    const touchTgtMovedDistance: number = originalTopCoord.current - endTopCoord.current;
    let distanceToIdx: number = 0;
    let insertCrit: number = 0;
    if (touchTgtMovedDistance < 0) {
      distanceToIdx = Math.floor((touchTgtMovedDistance * -1) / fooRef.current![0]);
      const idxToAdd: number =
        distanceToIdx >= originalLists.length - 1
          ? originalLists.length - 1
          : distanceToIdx;
      insertCrit =
        tgtIdx + idxToAdd + 1 > originalLists.length - 1
          ? originalLists.length
          : tgtIdx + idxToAdd + 1;
      const result = returnMoveRes({
        originalLists,
        insertCrit,
        tgtIdx,
        direction: 'down'
      });
      updateStateFuncs(result);
    } else if (touchTgtMovedDistance > 0) {
      distanceToIdx = Math.floor(touchTgtMovedDistance / fooRef.current![0]);
      const idxToSub: number =
        distanceToIdx >= originalLists.length - 1
          ? originalLists.length - 1
          : distanceToIdx;
      insertCrit = tgtIdx - idxToSub <= 0 ? 0 : tgtIdx - idxToSub;
      const result = returnMoveRes({ originalLists, insertCrit, tgtIdx, direction: 'up' });
      updateStateFuncs(result);
    }
  }

  return [makeTouchTgtClone, trackClonedTgt, highlightDragItem, detectDropEvt];
}
