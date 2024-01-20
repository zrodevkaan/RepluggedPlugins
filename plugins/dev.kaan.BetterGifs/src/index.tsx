import { Injector, util, webpack } from "replugged";
import { contextMenu } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { ContextMenuTypes } from "replugged/types";

const injector = new Injector();
const { GIFPickerSearchItem } = webpack.getByProps("GIFPickerSearchItem") as any;
const copyModule: any = webpack.getByProps("copy");

export function start() {
  injector.after(GIFPickerSearchItem.prototype, "render", (a, b) => {
    b.props.onContextMenu = (e) => {
      const Href = util.findInReactTree(b, x => x?.src);
      contextMenu.open(e, (props) =>
        <><ContextMenu.ContextMenu {...props} onClose={contextMenu.close} {...props}>
          <ContextMenu.MenuItem
            {...{
              label: "Copy Source",
              id: "copy-link-owo",
              action: () => {
                copyModule.copy(Href.src);
              },
            }} />
          <ContextMenu.MenuItem
            {...{
              label: "Copy URL",
              id: "copy-url-owo",
              action: () => {
                copyModule.copy(Href.url);
              },
            }} />
        </ContextMenu.ContextMenu></>);
    };
  });
  injector.utils.addMenuItem("expression-picker" as ContextMenuTypes, (data) => (
    <>
      <ContextMenu.MenuItem
        id="copy-source"
        label="Copy Source"
        action={() => {
          const StickerID = (data.target as HTMLAreaElement).getAttribute("data-id");
          copyModule.copy(replaceStickerURL(StickerID))
        }}
      />
    </>
  ));
}


export function stop(): void {
  injector.uninjectAll();
}

function replaceStickerURL(stickerID) {
  const StickerURL = "https://media.discordapp.net/stickers/%d.png?size=1280&passthrough=false";
  return StickerURL.replace('%d', stickerID); //isnt there some format method to do this ? I forgot it :3
}
