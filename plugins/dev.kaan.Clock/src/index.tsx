/* eslint-disable no-extend-native */
import { util, webpack, common } from "replugged";
import { injector, logger } from "./util";
import DraggableComponent from "./Draggable";

const { ReactDOM } = common;

const DIV_ID = "owo-i-like-dragging";

export function start() {
  let draggableDiv = document.getElementById(DIV_ID);
  if (!draggableDiv) {
    draggableDiv = document.createElement("div");
    draggableDiv.id = DIV_ID;
    const rootElement = document.getElementById("app-mount");
    if (rootElement) {
      rootElement.appendChild(draggableDiv);
    }
  }
  if (draggableDiv) {
    ReactDOM.render(<DraggableComponent />, draggableDiv);
  }
}

export function stop(): void {
  injector.uninjectAll();
  const draggableDiv = document.getElementById(DIV_ID);
  if (draggableDiv) {
    draggableDiv.remove();
  }
}
