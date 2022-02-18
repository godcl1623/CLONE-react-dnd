// export interface BasicActionReturn<T> {
//   type: string;
//   payload: T
// }

export interface BasicDndOptions {
  disableParent?: boolean;
  applyToChildren?: boolean;
  dragHandler?: () => void;
  dragendHandler?: () => void;
  dragenterHandler?: () => void;
  dragexitHandler?: () => void;
  dragleaveHandler?: () => void;
  dragoverHandler?: () => void;
  dragstartHandler?: () => void;
  dropHandler?: () => void;
}

export interface HandlerTemplateOptions {
  disablePreventDefault?: boolean;
  disableStopPropagation?: boolean;
}

export class HandlerTemplate {
  constructor(event: Event, handler: () => void, templateOptions?: HandlerTemplateOptions) {
    if (templateOptions != null) {
      const { disablePreventDefault, disableStopPropagation } = templateOptions;
      if (!disablePreventDefault) {
        event.preventDefault();
      }
      if (!disableStopPropagation) {
        event.preventDefault();
      }
      if (handler != null) {
        handler();
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
      if (handler != null) {
        handler();
      }
    }
  }
}
