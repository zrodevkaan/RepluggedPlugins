/* eslint-disable no-extend-native */
import { util, webpack, common } from "replugged";
import { injector, logger } from "./util";
import DraggableComponent from "./Draggable";

const { ReactDOM } = common;
const WhatsThis: { default: { type } } = webpack.getByProps("FakeActivityCharacter");
const { PLACEHOLDER_QR_CODE_URL }: { PLACEHOLDER_QR_CODE_URL: string } = webpack.getByProps(
  "FAMILY_CENTER_REFETCH_COOLDOWN",
);
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

  // what could this be ???
  injector.after(WhatsThis.default, "type", (a, b, c) => {
    const Button = util.findInTree(b, (x) => x?.className?.includes("button"));
    Button.children = "Click me :)";
    Button.onClick = () => {
      open(PLACEHOLDER_QR_CODE_URL);
    };
  });
}

export function stop(): void {
  injector.uninjectAll();
  const draggableDiv = document.getElementById(DIV_ID);
  if (draggableDiv) {
    draggableDiv.remove();
  }
}
