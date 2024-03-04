import { Injector, util, webpack } from "replugged";
import { contextMenu } from "replugged/common";
import { ContextMenu } from "replugged/components";
import {ContextMenuTypes} from "replugged/types";

const injector: Injector = new Injector();
const MenuItem: any = webpack.getByProps("MenuItem")
export function start(): void {
  injector.utils.addMenuItem("user-settings-cog" as ContextMenuTypes, MenuItem.MenuItem);
}
