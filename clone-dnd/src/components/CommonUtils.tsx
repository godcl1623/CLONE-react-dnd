import create, { State } from 'zustand';

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
    structure[`level_${innerLvl}`] = [node];
    while (q.length !== 0) {
      const v: HTMLElement = q.shift()! as HTMLElement;
      const list: HTMLElement[] = Array.from(v.children)! as HTMLElement[];
      if (list.length !== 0) {
        innerLvl += 1;
        structure[`level_${innerLvl}`] = list;
        for (let i = 0; i < v.children.length; i++) {
          q.push(v.children[i]! as HTMLElement);
        }
      }
    }
    return structure;
  }
}

export const useStore = create((set: ((state: State) => void)) => ({
  currentDragTarget: null,
  setDragTgt(dragTarget: HTMLElement | null): void {
    set({ currentDragTarget: dragTarget });
  },
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
}))