import { util, webpack } from "replugged";
import {ComponentsPack, injector, logger} from "./util";
import MyComponent from "./Pages/Plugin";

export function start() {
  injector.after(ComponentsPack.TabBar.prototype, "render", (a, b, c) => {
    console.log(a, b, c);
    if (b.props.children) {
      b.props.children.splice(
        23,
        0,
        <ComponentsPack.TabBar.Item
          id={"plugin-owo-tab"}
          onSelectItem={ MyComponent }
          element={ MyComponent }
        >
          Plugin Store
        </ComponentsPack.TabBar.Item>
      );
    }
  });
}

export function stop(): void {
  injector.uninjectAll();
}
