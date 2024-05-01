/* Stole this code from doggybootsy. He said it was okay <3 */

import React, { useMemo } from "react";
import { webpack } from "replugged";
import { AnyFunction } from "replugged/types";

const flux: { dispatch: AnyFunction } = webpack.getByProps(["subscribe", "_dispatch"]);
const PopoutWindowStore = webpack.getByStoreName("PopoutWindowStore");
interface PopoutWindow {
  getWindow: (id: string) => any;
}
const PopoutWindow: PopoutWindow = webpack.getBySource(/\([^)]*?.\.windowKey\)/);

export function openWindow(opts: { title: string; id: string; render: any; wrap?: boolean; }) {
  const { id, render: Component, title, wrap = true } = opts;

  const windowKey = `DISCORD_${id}`;

  function Render() {
    const poppedWindow = useMemo(() => PopoutWindowStore.getWindow(windowKey)!, []);

    if (!wrap) return <Component window={poppedWindow} />;
    
    return (
      <PopoutWindow
        windowKey={windowKey}
        title={title}
        withTitleBar
      >
        <Component window={poppedWindow} />
      </PopoutWindow>
    );
  }

  flux.dispatch({
    type: "POPOUT_WINDOW_OPEN",
    key: windowKey,
    render: () => <Render />,
    features: {
      popout: true,
    },
  });

  return () => closeWindow(id);
}

export function isWindowOpen(id: string) {
  return PopoutWindowStore.getWindowOpen(`DISCORD_${id}`);
}

export function closeWindow(id: string) {
  if (!isWindowOpen(id)) return;

  try {
    PopoutWindowStore.unmountWindow(`DISCORD_${id}`);
  } catch (error) {
  }
}
