import { Injector, common, components, settings, util, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";

const {
  ContextMenu: { MenuItem },
} = components;

const synth = window.speechSynthesis;
const inject = new Injector();
const owo = await settings.init("dev.kaan.voicechattotext");
const VoiceChannelStuff: { getVoiceChannelId: () => string } =
  webpack.getByProps("getVoiceChannelId");
const Flux: { subscribe: (owo, owo2) => void; unsubscribe: (owo, owo2) => void } =
  common.fluxDispatcher;
const { SwitchItem } = components;
interface UserDataType {
  channel: { id: string };
}

function textToSpeech(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = "en-GB";
  synth.speak(msg);
}

function messageLoggerxD(a: any) {
  const { globalName, username } = a.message.author;
  const whitelistedChannels = (owo.get("whitelistChannels") as Array<string[]>) || [];
  const shouldTTSSayUsername = owo.get("tts", false);
  if (!VoiceChannelStuff.getVoiceChannelId()) return;
  // this was made for my friend, dark who doesn't speak much but is very important to me.
  if (whitelistedChannels.includes(a.channelId)) {
    textToSpeech(
      `${
        shouldTTSSayUsername && globalName
          ? `${globalName} said`
          : shouldTTSSayUsername && username
          ? `${username} said`
          : ""
      } ${a.message.content}`,
    );
  }
}

export function start() {
  inject.utils.addMenuItem("channel-context" as ContextMenuTypes, (data: any) => {
    const { id } = data.channel;
    const currentWhitelist: string[] = owo.get("whitelistChannels") || [];
    const isWhitelisted = currentWhitelist.includes(id);

    return (
      <>
        {isWhitelisted ? (
          <MenuItem
            id="unwhitelist-channel"
            label="Unwhitelist Channel"
            action={() => unwhitelistChannel(data as unknown as UserDataType)}
          />
        ) : (
          <MenuItem
            id="whitelist-channel"
            label="Whitelist Channel"
            action={() => whitelistChannel(data as unknown as UserDataType)}
          />
        )}
      </>
    );
  });

  Flux.subscribe("MESSAGE_CREATE", messageLoggerxD);
}

function whitelistChannel(data: UserDataType) {
  const { id } = data.channel;

  const currentWhitelist: string[] = owo.get("whitelistChannels") || [];
  if (!currentWhitelist.includes(id)) {
    const updatedWhitelist = [...currentWhitelist, id];

    owo.set("whitelistChannels", updatedWhitelist);

    console.log(`Channel ${id} has been whitelisted.`);
  } else {
    console.log(`Channel ${id} is already whitelisted.`);
  }
}

function unwhitelistChannel(data: UserDataType) {
  const { id } = data.channel;

  const currentWhitelist: string[] = owo.get("whitelistChannels") || [];

  if (currentWhitelist.includes(id)) {
    const updatedWhitelist = currentWhitelist.filter((channelId) => channelId !== id);

    owo.set("whitelistChannels", updatedWhitelist);

    console.log(`Channel ${id} has been removed from the whitelist.`);
  } else {
    console.log(`Channel ${id} is not in the whitelist.`);
  }
}

export function stop() {
  Flux.unsubscribe("MESSAGE_CREATE", messageLoggerxD);
  inject.uninjectAll();
}

export function Settings() {
  return (
    <div>
      <SwitchItem
        {...util.useSetting(owo, "tts", false)}
        note={"Will make it so the voice says the username when a message is sent."}>
        TTS Username
      </SwitchItem>
    </div>
  );
}
