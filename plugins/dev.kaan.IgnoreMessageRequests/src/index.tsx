import { Injector, util, webpack } from "replugged";
import { contextMenu } from "replugged/common";
import { ContextMenu } from "replugged/components";

const injector: Injector = new Injector();
const MessageRequestsTab: any = webpack.getByProps("Interactive");
const MessageRequestStore: any = webpack.getByStoreName("MessageRequestStore");

interface ReactTreeItem {
  to?: {
    pathname?: string;
  };
  props: { onContextMenu: Function };
}

export function start(): void {
  injector.after(MessageRequestsTab, "Interactive", (a, b: ReactTreeItem, c) => {
    const pathName = util.findInReactTree(b as {}, (x) => x?.to?.pathname)?.to?.pathname;

    if (pathName?.includes("message")) {
      b.props.onContextMenu = (e) => {
        contextMenu.open(e, (props) => (
          <>
            <ContextMenu.ContextMenu
              navId={"i-love-furries"}
              {...props}
              onClose={contextMenu.close}>
              <ContextMenu.MenuItem
                label="Ignore All"
                id="ignore-all-owo"
                action={() => {
                  console.log(a, b);
                }}
              />
            </ContextMenu.ContextMenu>
          </>
        ));
      };
    }
  });
}
