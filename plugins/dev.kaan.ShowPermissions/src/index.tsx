import { Injector, common, settings, webpack, util } from "replugged";
const { fluxDispatcher } = common;

const injector = new Injector();

export function start() {
  injector.after(, "render", (a, b, c) => {

  });
}

export function stop(): void {
  injector.uninjectAll();
}
