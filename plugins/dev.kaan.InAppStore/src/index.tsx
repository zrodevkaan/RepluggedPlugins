import { ComponentsPack, injector, logger } from "./util";
import JustWorkPlease from "./Pages/Plugin";
import JustWorkPleasButWithThemes from "./Pages/Themes";
import { waitForModule, filters } from "replugged/webpack";
import "./styles.css";
async function patch() {
  const Settings: { default: () => {} } = await waitForModule(
    filters.bySource("getPredicateSections"),
  );
  injector.after(Settings.default.prototype, "getPredicateSections", (a, b, c) => {
    b.splice(24, 0, {
      section: "owo-select-plugins",
      label: "Plugin Store",
      name: "owo-select-plugins",
      element: JustWorkPlease,
    });
    b.splice(25, 0, {
      section: "owo-select-themes",
      label: "Theme Store",
      name: "owo-select-themes",
      element: JustWorkPleasButWithThemes,
    });
  });
}
export function start() {
  void patch();
}

export function stop(): void {
  injector.uninjectAll();
}
