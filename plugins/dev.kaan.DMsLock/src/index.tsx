import { common, components, Injector, settings, util, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { Encry } from "./Encry";

const injector = new Injector();
const owo = await settings.init("dev.kaan.dmslock");
const ChannelStuff: { selectChannel: () => [] } = webpack.getByProps("selectChannel");
const ChannelStore: any = webpack.getByStoreName("ChannelStore");
const ModalList: any = webpack.getByProps("ConfirmModal");

const {
  ContextMenu: { MenuItem },
} = components;

const {
  React,
  modal,
  toast: {
    Kind: { FAILURE, SUCCESS },
    toast,
  },
  users,
} = common;

const { colorBrand } = webpack.getByProps("colorBrand");

interface Information {
  data: Array<[channelId: string, guildId: string, messageId: string | null]>;
}

const { encryptString, decryptString } = DiscordNative.safeStorage;

export function start() {
  injector.instead(ChannelStuff, "selectChannel", (a: any, b, c) => {
    const channelData: Information | any = a?.[0];
    const channelId = channelData.channelId;

    const channelObject = ChannelStore.getChannel(channelId);
    const user = channelObject.rawRecipients?.[0];

    if (!user) return b(...a);

    const passwords = owo.get("passwords") || [];
    const isUserInPasswords = passwords.some((item: { userId: string }) => item.userId === user.id);

    if (isUserInPasswords) {
      passwordUnlockDMModal(user, (password: string) => {
        if (checkPassword(user.id, password)) {
          return b(...a);
        } else {
          return null;
        }
      });
    } else {
      return b(...a);
    }
  });

  injector.utils.addMenuItem("user-context" as ContextMenuTypes, (data: any) => (
    <>
      <MenuItem label="DMsLock" id={"DMsLock-owo-stuff-submenu"}>
        <MenuItem
          id="add-lock"
          label="Set Lock"
          action={() => {
            passwordLockDMModal(data.user);
          }}
        />
        <MenuItem
          id="remove-Lock"
          label="Clear Lock"
          action={() => {
            clearPasswordLock(data.user.id);
          }}
        />
      </MenuItem>
    </>
  ));
}

async function passwordUnlockDMModal(user: { username: string; id: string }, callback: (password: string) => void) {
  let password = "";

  modal.openModal((props) => (
    <ModalList.ConfirmModal
      {...props}
      header={`Enter Password to Unlock ${user.username}'s DMs`}
      confirmButtonColor={colorBrand}
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={async () => {
        callback(password);
      }}
    >
      <ModalList.TextInput
        placeholder="Enter password"
        onChange={(thisPassword) => {
          password = thisPassword;
        }}
      />
    </ModalList.ConfirmModal>
  ));
}

function checkPassword(userId: string, password: string): boolean {
  const passwords = owo.get("passwords") || [];
  const userPassword = passwords.find((item: { userId: string }) => item.userId === userId);
  if (userPassword) {
    return decryptString(userPassword.password) === password;
  }
  return false;
}

async function passwordLockDMModal(_user: { username: string; id: string }) {
  const user = _user;
  let password = "";

  modal.openModal((props) => (
    <ModalList.ConfirmModal
      {...props}
      header={`Set ${user.username}'s DM Password!`}
      confirmButtonColor={colorBrand}
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={async () => {
        password = encryptString(password);
        const passwords = owo.get("passwords") || [];
        owo.set("passwords", [...passwords, { userId: user.id, password }]);
      }}
    >
      <ModalList.TextInput
        placeholder="Set any password. As long as you want :3"
        onChange={(thisPasswordWILLBeLeaked) => {
          password = thisPasswordWILLBeLeaked;
        }}
      />
    </ModalList.ConfirmModal>
  ));
}

async function clearPasswordLock(userId: string) {
  let password = "";
  modal.openModal((props) => (
    <ModalList.ConfirmModal
      {...props}
      header={`Enter Password to Clear Lock`}
      confirmButtonColor={colorBrand}
      confirmText="Confirm"
      cancelText="Cancel"
      onConfirm={async () => {
        if (checkPassword(userId, password)) {
          const passwords = owo.get("passwords") || [];
          const updatedPasswords = passwords.filter((item: { userId: string }) => item.userId !== userId);
          owo.set("passwords", updatedPasswords);         
        }
      }}
    >
      <ModalList.TextInput
        placeholder="Enter your password to confirm"
        onChange={(thisPassword) => {
          password = thisPassword;
        }}
      />
    </ModalList.ConfirmModal>
  ));
}

export function stop(): void {
  injector.uninjectAll();
}

export function Settings() {}
