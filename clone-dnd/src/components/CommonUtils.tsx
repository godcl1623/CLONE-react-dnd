import create from 'zustand';
import { devtools } from 'zustand/middleware';

/* eslint-disable class-methods-use-this */
export interface BasicActionCreator<T> {
  type: string;
  payload: T
}

type ItemCategory = Record<string, string[]>;

export interface BasicDndOptions {
  currentItemCategory?: ItemCategory | (string | string[])[];
  disableCurrent?: boolean;
  applyToChildren?: boolean;
}

export type Structure = Record<string, HTMLElement[]>
export class CommonUtils {
  drawDndTargetMap = (node: HTMLElement, lvl: number = 0): Structure => {
    const structure: Structure = {};
    const q: HTMLElement[] = [node];
    let innerLvl: number = lvl;
    let numOfNextLvl: number = 0;
    structure[`level_${innerLvl}`] = [];
    let temporaryStorage = [];
    while (q.length !== 0) {
      const currentElement: HTMLElement = q.shift()! as HTMLElement;
      if (innerLvl === lvl) {
        structure[`level_${innerLvl}`].push(currentElement);
        Array.from(currentElement.children).forEach(child => q.push(child as HTMLElement));
        innerLvl += 1;
        numOfNextLvl += currentElement.children.length;
      } else {
        temporaryStorage.push(currentElement);
        if (numOfNextLvl === temporaryStorage.length) {
          structure[`level_${innerLvl}`] = temporaryStorage;
          const rawCurrEleChildren = temporaryStorage.map(child => Array.from(child.children));
          const procCurrEleChildren = rawCurrEleChildren.reduce((acc, curr) => acc.concat(curr));
          procCurrEleChildren.forEach(child => q.push(child as HTMLElement));
          numOfNextLvl = procCurrEleChildren.length;
          temporaryStorage = [];
          innerLvl += 1;
        }
      }
    }
    return structure;
  }
}

export const useStore = create<any>(devtools(set => ({
  currentDragCategory: '',
  setDragCat(category: string): void {
    set({ currentDragCategory: category });
  },
  currentDropCategory: '',
  setDropCat(category: string): void {
    set({ currentDropCategory: category });
  },
  currentDropTarget: null,
  setDropTgt(dropTarget: HTMLElement | null): void {
    set({ currentDropTarget: dropTarget });
  },
  dropMap: null,
  setDropMap(dropMap: Structure): void {
    set({ dropMap });
  },
  isDropped: false,
  setDropState(dropState: boolean): void {
    set({ isDropped: dropState });
  }
})))