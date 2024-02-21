import React, {FC, useState} from "react";
import { common, Injector, settings, util, webpack } from "replugged";
import { Button, SwitchItem, TextArea, TextInput } from "replugged/components";

const { fluxDispatcher } = common;
const Settings: { TabBar: { prototype: () => React.FC } } = webpack.getByProps("TabBar").TabBar.prototype
export const owo = await settings.init("dev.kaan.bettersettings");
const injector = new Injector();

interface Message {
  [1]: {};
  content: String;
}

export function start() {
  /*injector.after(Settings, "render", (a,b,c) =>
  {
    console.log(a,b,c)
  })*/
}

export function stop(): void {
  injector.uninjectAll();
}
