export interface BasicActionCreator<T> {
  type: string;
  payload: T
}

type ItemCategory = Record<string, string[]>;

export interface BasicDndOptions {
  // currentItemCategory?: (string | string[])[];
  currentItemCategory?: ItemCategory | (string | string[])[];
  disableParent?: boolean;
  applyToChildren?: boolean;
  dragHandler?: (e: Event) => void;
  dragendHandler?: (e: Event) => void;
  dragenterHandler?: (e: Event) => void;
  dragexitHandler?: (e: Event) => void;
  dragleaveHandler?: (e: Event) => void;
  dragoverHandler?: (e: Event) => void;
  dragstartHandler?: (e: Event) => void;
  dropHandler?: (e: Event) => void;
}

export interface HandlerTemplateOptions {
  disablePreventDefault?: boolean;
  disableStopPropagation?: boolean;
}

export class HandlerTemplate {
  constructor(event: Event, handler: (e: Event) => void, templateOptions?: HandlerTemplateOptions) {
    if (templateOptions != null) {
      const { disablePreventDefault, disableStopPropagation } = templateOptions;
      if (!disablePreventDefault) {
        event.preventDefault();
      }
      if (!disableStopPropagation) {
        event.preventDefault();
      }
      if (handler != null) {
        handler(event);
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
      if (handler != null) {
        handler(event);
      }
    }
  }
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