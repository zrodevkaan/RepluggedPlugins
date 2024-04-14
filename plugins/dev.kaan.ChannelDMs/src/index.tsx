import {components, Injector, settings, webpack} from "replugged";
import {modal, React, toast} from "replugged/common";
import {AnyFunction, ContextMenuTypes} from "replugged/types";
import {getByStoreName} from "replugged/webpack";
import { Modal } from "replugged/components";
import {ChannelStore} from "discord-types/stores";
import {ReactElement} from "react";
export interface SettingsType {
  roleColor?: boolean;
}

const owo = await settings.init<SettingsType>("dev.kaan.channeldms");
const inject = new Injector();
const ChannelContext = React.createContext(null);

const {
  ContextMenu: { MenuItem },
} = components;
const {getDMFromUserId}: ChannelStore = webpack.getByProps("getDMFromUserId")
const {getChannel}: ChannelStore = webpack.getByStoreName("ChannelStore")
type ChatBoxType = () => ReactElement;

interface AdditionalProps {
  channel: string;
  chatBarType: string;
}

// Define the new type of ChatBox with the modified props
const ChatBox: { type: () => ReactElement<AdditionalProps> } = webpack.getModule(
  (m) => m?.exports?.default?.type?.toString().indexOf('communicationDisabledUntil') > -1
);;
const {ChatInputTypes}: any = webpack.getByProps("ChatInputTypes") ?? {};
export function start() {
  inject.utils.addMenuItem(ContextMenuTypes.UserContext, (something,elsee) => {
    return (
        <MenuItem label="open dms" id={"DMsLock-owo-stuff-submenu"}
                action={() => {
                  OpenModal(something);
                }}>
        </MenuItem>
  );
  })
}

export function Settings() {

}

/**
 * @param data
 * @constructor
 * this dowes opwen dings ;3
 */
function OpenModal(data: any) {
  const dmUserChannel = getDMFromUserId(data?.user?.id);
  webpack.getModule(x=>x && typeof x?.exports?.default?.fetchMessages === 'function').fetchMessages({channelId: dmUserChannel})
  if (dmUserChannel)
  {
    modal.openModal((props) => (
      <Modal.ModalRoot size="large" {...props}>
        <Modal.ModalContent style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          flex: '1 1 auto',
          height: '1000px',
          background: 'var(--bg-overlay-chat,var(--background-primary))'
        }}>
          <ChatBox.type
            {...props}
            channel={getChannel(dmUserChannel)}
            chatInputType={ChatInputTypes.OVERLAY}
          />
        </Modal.ModalContent>
      </Modal.ModalRoot>
    ));
  }
  else 
  {
    toast.toast(`Couldn't open ${data?.user?.username}'s channel. Try opening a channel manually!`, toast.Kind.FAILURE)
  }
}

export function stop() {
  inject.uninjectAll();
}
