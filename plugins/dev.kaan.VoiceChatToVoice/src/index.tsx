import { Injector, common, components, settings, util, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { Guild } from "discord-types/general";
import { Select, Slider, SliderItem, Tooltip } from "replugged/components";
import Poggers from "./poggers";

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
const ActualGuildStore: any = webpack.getByStoreName("GuildStore");
const ChannelStore: any = webpack.getByStoreName("ChannelStore");
const UserStore: any = webpack.getByStoreName("UserStore");
const VoiceStore: any = webpack.getByProps("getVoiceChannelId");
const { SwitchItem, Switch } = components;
const ChannelItem: any = webpack.getBySource("webGuildTextChannel");
const ChannelItemIcon: any = webpack.getByProps("ChannelItemIcon");
const IconsClasses: any = webpack.getByProps("iconItem");
interface UserDataType {
  channel: { id: string };
}

let availableVoices = window.speechSynthesis.getVoices();

function textToSpeech(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.pitch = owo.get("pitch", 1);
  msg.volume = owo.get("volume", 1);

  const selectedVoiceURI = owo.get("selectedVoiceURI", availableVoices[0]?.voiceURI);
  const voice = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);

  if (voice) {
    msg.voice = voice;
    msg.lang = voice.lang;
  } else {
    console.warn(
      `Voice with URI ${selectedVoiceURI} not found, default voice and language will be used.`,
    );
  }

  synth.speak(msg);
}

function messageLoggerxD(a: any) {
  const { globalName, username } = a.message.author;
  const { channelId } = a;
  const whitelistedChannels = owo.get("whitelistChannels") || [];
  const shouldTTSSayUsername = owo.get("tts", false);
  const currentVoiceChannelId = VoiceStore.getVoiceChannelId();
  const speakerAttribution = shouldTTSSayUsername ? `${globalName || username} said` : "";
  const messageGuildId = ChannelStore.getChannel(channelId).guild_id;

  if (!currentVoiceChannelId) return;
  if (UserStore.getCurrentUser().username === username) return;
  if (messageGuildId !== ChannelStore.getChannel(currentVoiceChannelId).guild_id) return;

  const content = a.message.content;
  if (whitelistedChannels.includes(channelId)) {
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
      <>
        <MenuItem id={"femboys"} label={"VoiceChatToVoice"}>
          <MenuItem
            id={label.toLowerCase().replace(" ", "-")}
            label={label}
            action={() => action(data as unknown as UserDataType)}
          />
          {isWhitelisted && (
            <MenuItem id={"stop-voice"} label={"Stop Voice"} action={() => synth.cancel()} />
          )}
        </MenuItem>
      </>
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

  inject.after(ChannelItemIcon, "default", (a: any, b, c) => {
    const currentWhitelist: string[] = owo.get("whitelistChannels") || [];
    const children: any = util.findInReactTree(
      b,
      (m: any) => m?.props?.onClick?.toString().includes("stopPropagation") && m.type === "div",
    );

    if (children?.props?.children && currentWhitelist.includes(a?.[0]?.channel?.id))
      children.props.children.push(
        <Tooltip
          text="OwO. This channel is whitelisted under the 'VoiceChatToChat' plugin :) "
          className={`${IconsClasses.iconItem}`}
          style={{
            display: "block",
          }}>
          <Poggers className={`${IconsClasses.actionIcon}`} />
        </Tooltip>,
      );
  });

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

const ChannelComponent = ({ channelId }) => (
  <div key={channelId}>
    {channelId}
    <ChannelItem
      style={{ margin: "5px 0" }}
      channel={ChannelStore?.getChannel(channelId)}
      guild={ActualGuildStore.getGuild(ChannelStore.getChannel(channelId)?.guild_id)}
    />
  </div>
);

export function Settings() {
  const whitelistChannels = owo.get("whitelistChannels") || [];

  return (
    <div>
      <SwitchItem
        {...util.useSetting(owo, "tts", false)}
        note="Will make it so the voice says the username when a message is sent.">
        TTS Username
      </SwitchItem>
      <SwitchItem {...util.useSetting(owo, "debug", false)} note="Enable or disable debug logs.">
        Debug Mode
      </SwitchItem>
      <SliderItem {...util.useSetting(owo, "pitch", 1)} note="Pitch of the speech. (Range: 0 - 2)">
        Pitch
      </SliderItem>
      <SliderItem
        minValue={0}
        maxValue={2}
        {...util.useSetting(owo, "volume", 1)}
        note="The volume of the voice.">
        Volume
      </SliderItem>
      <Select
        {...util.useSetting(owo, "selectedVoiceURI", availableVoices[0]?.voiceURI)}
        options={availableVoices.map((voice) => ({ label: voice.name, value: voice.voiceURI }))}
        value={owo.get("selectedVoiceURI", availableVoices[0]?.voiceURI)}>
        Select Voice
      </Select>
      <div>
        {whitelistChannels.map((channelId) => (
          <ChannelComponent channelId={channelId} />
        ))}
      </div>
    </div>
  );
}
