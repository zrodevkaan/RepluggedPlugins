import { util, webpack, coremods } from "replugged";
import { ComponentsPack, injector, logger } from "./util";
import JustWorkPlease from "./Pages/Plugin";
import { waitForModule, filters } from "replugged/webpack";
const Settings = await waitForModule(filters.bySource("getPredicateSections"));
export async function start() {
  injector.after(Settings.default.prototype, "getPredicateSections", (a, b, c) => {
    console.log(a, b, c);
    const didFindButton = b.findIndex((section) => section.label === "Plugin Store");
    if (didFindButton) {
      b.splice(24, 0, {
        section: "owo-select",
        label: "Plugin Store",
        name: "owo-select",
        element: JustWorkPlease,
      });
    }
  });
}

export function stop(): void {
  injector.uninjectAll();
}
