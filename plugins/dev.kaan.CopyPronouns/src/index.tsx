import { Injector, common, settings, webpack, util } from "replugged";
import React from "react";
const { fluxDispatcher } = common;

const injector = new Injector();
const pronouns = webpack.getBySource('copyMetaData:"User Tag",',{raw:true})?.exports;
const { getUserProfile } = webpack.getByStoreName("UserProfileStore")
const { copy } = DiscordNative.clipboard;
export function start() {
  injector.after(pronouns,"default",(a,b: {props: {text: {}}},c)=>{
    const Pronouns = a[0].pronouns;
    b.props.onClick = () => {copy(Pronouns)}
  })
}

export function stop(): void {
  injector.uninjectAll();
}
