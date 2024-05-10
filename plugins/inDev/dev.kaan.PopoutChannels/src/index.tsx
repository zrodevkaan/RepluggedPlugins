import React from "react";
import { components, Injector, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { openWindow } from "./VXWrapperCode";

const inject = new Injector();

const Channel = await webpack.waitForModule(webpack.filters.bySource('"Missing channel in Channel.renderCall"'));
const ChannelStore = webpack.getByStoreName('ChannelStore')
const ReactRouter = webpack.getByProps([ "Route", "Switch", "BrowserRouter" ]);

const {
  ContextMenu: { MenuItem },
} = components;

function createOpenInPopoutMenuItem(data) {
  return (
    <MenuItem
      id="open-in-popout"
      label="Open In Popout"
      action={() => {
        console.log(Channel,ReactRouter)
        openWindow({
          title: data?.guild?.name ?? data?.channel?.name ?? "Private Message",
          id: data.channel.id,
          render({ window }) {
            React.useInsertionEffect(() => {
              const style = window.document.createElement("style");

              style.innerHTML = `[class*="content_"] > [class*="chat_"] { width: 100% }`;

              window.document.body.append(style);
            }, []);

            return (
              <ReactRouter.BrowserRouter>
                <Channel providedChannel={ChannelStore.getChannel(data.channel.id)} />
              </ReactRouter.BrowserRouter>
            );
          }
        });
      }}
    />
  );
}

const ContextMenuList = [
  ContextMenuTypes.UserContext,
  ContextMenuTypes.ChannelContext,
  ContextMenuTypes.GdmContext,
];

export function start() {
  ContextMenuList.forEach(Menu => {
    inject.utils.addMenuItem(Menu, (data) =>
      createOpenInPopoutMenuItem(data)
    );
  });
}

export function stop() {
  inject.uninjectAll();
}

