/* eslint-disable no-extend-native */
import { util, webpack, common } from "replugged";
import { injector, logger } from "./util";
import DraggableComponent from "./Draggable";

const { ReactDOM } = common;

const DIV_ID = "owo-i-like-dragging";

export function start() {
  let DraggableHolder = document.getElementById(DIV_ID);

  if (!DraggableHolder) {
    DraggableHolder = document.createElement("div");
    DraggableHolder.id = DIV_ID;

    const AppMount = document.getElementById("app-mount");
    AppMount && AppMount.appendChild(DraggableHolder);
  }

  ReactDOM.render(<DraggableComponent />, DraggableHolder);
}

export function stop(): void {
  injector.uninjectAll();
  const draggableDiv = document.getElementById(DIV_ID);
  if (draggableDiv) {
    draggableDiv.remove();
  }
}
