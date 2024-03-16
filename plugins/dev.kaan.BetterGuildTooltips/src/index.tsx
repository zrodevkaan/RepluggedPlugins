import { Injector, common, settings, webpack, util } from "replugged";
import React from "react";
const { fluxDispatcher } = common;

const injector = new Injector();
const CallPanel: { Link: { render: any } } = webpack.getByProps(["Link", "Route"]);
const GuildTooltip: {default: () => React.FC} = webpack.getByProps("GuildTooltipText");
const {getMemberCount, getOnlineCount}: any = webpack.getByStoreName("GuildMemberCountStore");
const {preload}: any = webpack.getByProps("preload")
const {getGuild}: any = webpack.getByStoreName("GuildStore");
export function start() {
  injector.after(GuildTooltip,"default",(a,b: {props: {text: {}}},c)=>{
    const Guild: any = util.findInTree(b,x=>Boolean(x?.guild))?.guild ?? {id: "1000926524452647132"}
    // preload doesn't work here but does in console ?
    // console.log(getGuild(Guild.id))
    b.props.text = [b?.props?.text]
    b.props.text.push(<span>Members: {getMemberCount(Guild.id)}</span>)
  })
}

export function stop(): void {
  injector.uninjectAll();
}
