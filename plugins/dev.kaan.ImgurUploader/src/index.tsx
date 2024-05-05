/* eslint-disable no-extend-native */
import exp from "node:constants";
import { components, Injector, settings, webpack } from "replugged";
import { TextInput } from "replugged/components";
import {ContextMenuTypes} from "replugged/types";
import React from "react";
const {
  ContextMenu: { MenuItem },
} = components;
const injector = new Injector();
export const owo = await settings.init("dev.kaan.imguruploader");
// @ts-ignore
const FileManager: any = webpack.getModule(x => x?.exports?.default?.fileManager?.openFiles).fileManager
const {InboxIcon}: any = webpack.getByProps("InboxIcon");
const {copy} = DiscordNative.clipboard
// this is lazy but I want an icon

const IconWithLabel = ({ icon, label }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <span style={{ marginLeft: '0.5rem' }}>{label}</span>
    </div>
  );
};

const SomeComponent = () => {
  return (
    <div>
      <IconWithLabel icon={<InboxIcon />} label="Upload Image" />
    </div>
  );
};

function StartFileUpload()
{
  const imgurKey = owo.get('imgurKey', undefined);
  FileManager.openFiles({ filters: "" })
    .then(async (x) => {
      const fileData = x?.[0];
      if (!fileData) return;
      const file = new File([fileData.data], fileData.filename, { type: 'application/octet-stream' });
      const formData = new FormData()
      formData.append("image", file)
      await fetch("https://api.imgur.com/3/image/", {
        method: "post",
        headers: {
          Authorization: `Client-ID ${imgurKey}`
        },
        body: formData
      }).then(data => data.json()).then(data => {
        // console.log(data.data.link) // https://i.imgur.com/wlrHIfY.png - IMAGE FORMAT
        copy(data.data.link)
      })
    });
}

export function start() {
  const imgurKey = owo.get('imgurKey', undefined);

  const menuItem = imgurKey !== undefined && (
    <MenuItem
      id="upload-image"
      label={SomeComponent as unknown as string}
      action={() => {
        StartFileUpload();
      }}
    />
  );

  injector.utils.addMenuItem(ContextMenuTypes.ChannelAttach, (data) => menuItem);
}


export function stop(): void {
  injector.uninjectAll();
}

function InsetSettings() {
  const [text, setText] = React.useState("");
  return <TextInput value={owo.get('imgurKey', undefined)} placeholder={'Insert Imgur API Key.'} onChange={(s) => {setText(s); owo.set('imgurKey', s);}}/>
}

export function Settings() {
  return <InsetSettings />;
}

