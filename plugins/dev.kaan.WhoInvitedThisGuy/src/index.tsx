/* eslint-disable no-extend-native */
import { Injector, util, webpack } from "replugged";

const injector = new Injector();
const { MessageAccessories }: any = webpack.getBySource("renderRemoveAttachmentConfirmModal");
const Embeds: { default: () => boolean } | any = webpack.getBySource("renderSuppressButton");
export function start() {}

export function stop(): void {
  injector.uninjectAll();
}
