import create, { State } from 'zustand';
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
    // let nextLvlChildren: number = 0;
    structure[`level_${innerLvl}`] = [node];
    while (q.length !== 0) {
      const v: HTMLElement = q.shift()! as HTMLElement;
      const list: HTMLElement[] = Array.from(v.children)! as HTMLElement[];
      // nextLvlChildren += list.length;
      // if (q.length === 0) {
      //   console.log('foo')
      // }
      if (list.length !== 0) {
        innerLvl += 1;
        structure[`level_${innerLvl}`] = list;
        for (let i = 0; i < v.children.length; i++) {
          q.push(v.children[i]! as HTMLElement);
        }
      }
      // console.log('v: ', v)
      // console.log('list: ', list)
      // console.log('q: ', q)
      // console.log('structure: ', structure)
    }
    return structure;
  }
}

export const useStore = create<any>(devtools(set => ({
  // currentDragTarget: null,
  // setDragTgt(dragTarget: HTMLElement | null): void {
  //   set({ currentDragTarget: dragTarget });
  // },
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