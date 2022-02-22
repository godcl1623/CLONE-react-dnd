export interface BasicActionCreator<T> {
  type: string;
  payload: T
}

export interface BasicDndOptions {
  currentItemCategory?: string[];
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
