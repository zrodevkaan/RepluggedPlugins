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
const GuildStore: any = webpack.getByStoreName("SelectedGuildStore");
const ChannelStore: any = webpack.getByStoreName("ChannelStore");
const UserStore: any = webpack.getByStoreName("UserStore");
const VoiceStore: any = webpack.getByProps("getVoiceChannelId");
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
  const { channelId } = a;
  const whitelistedChannels = owo.get('whitelistChannels') || [];
  const shouldTTSSayUsername = owo.get("tts", false);
  const currentVoiceChannelId = VoiceStore.getVoiceChannelId();
  const speakerAttribution = shouldTTSSayUsername ? `${globalName || username} said` : "";
  const messageGuildId = ChannelStore.getChannel(channelId).guild_id;

  if (!currentVoiceChannelId) return;
  if (UserStore.getCurrentUser().username === username) return;
  if (messageGuildId !== ChannelStore.getChannel(currentVoiceChannelId).guild_id) return;

  const content = a.message.content;
  if (whitelistedChannels.includes(channelId))
  {
    // this was made for my friend, dark who doesn't speak much but is very important to me.
    const messageWithoutLinks = content
      .split(" ")
      .filter((word) => !/^https?:\/\//.test(word))
      .filter(Boolean)
      .join(" ");

    textToSpeech(`${speakerAttribution} ${messageWithoutLinks}`); 
  }
}
export function start() {
  const createMenuItem = (contextType: ContextMenuTypes) => (data: any) => {
    const { id } = data.channel;
    const currentWhitelist: string[] = owo.get("whitelistChannels") || [];
    const isWhitelisted = currentWhitelist.includes(id);

    const action = isWhitelisted ? unwhitelistChannel : whitelistChannel;
    const label = isWhitelisted ? "Unwhitelist Channel" : "Whitelist Channel";

    return (
      <MenuItem
        id={label.toLowerCase().replace(" ", "-")}
        label={label}
        action={() => action(data as unknown as UserDataType)}
      />
    );
  };

  inject.utils.addMenuItem(
    "channel-context" as ContextMenuTypes,
    createMenuItem("channel-context" as ContextMenuTypes),
  );
  inject.utils.addMenuItem(
    "user-context" as ContextMenuTypes,
    createMenuItem("user-context" as ContextMenuTypes),
  );
  // looks nicer ngl.....

  Flux.subscribe("MESSAGE_CREATE", messageLoggerxD);
}

function whitelistChannel(data: UserDataType) {
  const { id } = data.channel;
  const currentWhitelist: string[] = owo.get("whitelistChannels") || [];

  if (!currentWhitelist.includes(id)) {
    owo.set("whitelistChannels", [...currentWhitelist, id]);
  }

  if (owo.get("debug")) {
    console.log(
      `Channel ${id} is ${currentWhitelist.includes(id) ? "already" : "now"} whitelisted.`,
    );
  }
}

function unwhitelistChannel(data: UserDataType) {
  const { id } = data.channel;
  const currentWhitelist: string[] = owo.get("whitelistChannels") || [];

  if (currentWhitelist.includes(id)) {
    owo.set(
      "whitelistChannels",
      currentWhitelist.filter((channelId) => channelId !== id),
    );
  }

  if (owo.get("debug")) {
    console.log(`Channel ${id} is ${currentWhitelist.includes(id) ? "" : "not"} in the whitelist.`);
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
      <SwitchItem {...util.useSetting(owo, "debug", false)} note={"Enable or disable debug logs."}>
        Debug Mode
      </SwitchItem>
    </div>
  );
}
