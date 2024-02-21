/* eslint-disable no-extend-native */
import { Injector, util, webpack } from "replugged";
import { contextMenu } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { ContextMenuTypes } from "replugged/types";
import { Base } from "replugged/dist/renderer/coremods/badges/badge";

const injector = new Injector();
const { GIFPickerSearchItem } = webpack.getByProps("GIFPickerSearchItem") as any;
const copyModule: any = webpack.getByProps("copy");
const MessageEngine: any = webpack.getByProps("sendMessage");
const SelectedChannelStore: any = webpack.getByStoreName("SelectedChannelStore");

export function start() {
  injector.after(GIFPickerSearchItem.prototype, "render", (a, b) => {
    b.props.onContextMenu = (e) => {
      const Href = util.findInReactTree(b, (x) => Boolean(x?.src));
      contextMenu.open(e, (props) => (
        <>
          <ContextMenu.ContextMenu {...props} onClose={contextMenu.close} {...props}>
            <ContextMenu.MenuItem
              {...{
                label: "Copy Source",
                id: "copy-link-owo",
                action: () => {
                  copyModule.copy(Href.src);
                },
              }}
            />
            <ContextMenu.MenuItem
              {...{
                label: "Copy URL",
                id: "copy-url-owo",
                action: () => {
                  copyModule.copy(Href.url);
                },
              }}
            />
            <ContextMenu.MenuItem
              {...{
                label: "Send URL",
                id: "send-url-owo",
                action: () => {
                  const SendMessageData = [
                    SelectedChannelStore.getCurrentlySelectedChannelId(),
                    {
                      content: Href.url || Href.src,
                      tts: false,
                      invalidEmojis: [],
                      validNonShortcutEmojis: [],
                    },
                    undefined,
                    {},
                  ];
                  MessageEngine.sendMessage(...SendMessageData);
                },
              }}
            />
          </ContextMenu.ContextMenu>
        </>
      ));
    };
  });
  injector.utils.addMenuItem("expression-picker" as ContextMenuTypes, (data, pp) => (
    <>
      <ContextMenu.MenuItem
        id="copy-source"
        label="Copy Source"
        action={() => {
          const Base = data.target as HTMLBaseElement;
          const StickerID = Base.dataset.id;
          let isEmoji = Base.className.includes("emoji");
          copyModule.copy(replaceStickerURL(StickerID, isEmoji));
        }}
      />
    </>
  ));
}

export function stop(): void {
  injector.uninjectAll();
}

function replaceStickerURL(stickerID, isEmoji) {
  const StickerURL = "https://media.discordapp.net/stickers/%d.png?size=1280&passthrough=false";
  const BaseChange = StickerURL.replace("%d", stickerID);
  return isEmoji ? BaseChange.replace("stickers", "emojis") : BaseChange; //isnt there some format method to do this ? I forgot it :3
}
