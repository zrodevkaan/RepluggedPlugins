import { Injector, common, settings, webpack, util } from "replugged";
import VoiceRegisteredComponent from "./voice";
const { fluxDispatcher } = common;

const injector = new Injector();
const CallPanel: { Link: { render: any } } = webpack.getByProps(["Link", "Route"]);

export function start() {
  injector.after(CallPanel.Link, "render", (a, b, c) => {
    const ChannelDetection = util.findInTree(a as {}, (x) => x?.className?.includes("channel"));

    if (!ChannelDetection) return;
    // for some reason Link didn't have a `children` property
    // how ?
    if (!ChannelDetection.hasOwnProperty("children")) return;

    ChannelDetection.children = [ChannelDetection.children, <VoiceRegisteredComponent />];
  });
}

export function stop(): void {
  injector.uninjectAll();
}
