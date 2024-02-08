import { Injector, Logger, common, components, settings, util, webpack } from "replugged";

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
  users
} = common;

interface WebpackProps {
  colorBrand: string;
}
interface UserData {
  username: string;
  id: string;
}

interface UserStore {
  getUser: (string: string) => {};
}
interface UserType {
  id: string;
}

import "./styles.css";
import { ContextMenuTypes } from "replugged/types";

const SettingConfig = await settings.init("CakeDay");
const BLUE = (webpack.getByProps("colorBrand") as WebpackProps).colorBrand;
const inject = new Injector();
const logger = Logger.plugin("CakeDay");
const ModalList: any = webpack.getByProps("ConfirmModal"); // CAN YOU STOP NOW. THANKS <3
const FriendRow: any = webpack.getBySource("isActiveRow:!1");
const PresenceStore: any = webpack.getByStoreName("PresenceStore");
const UsernamePatch: any = webpack.getBySource(/([a-j]+)\.nameAndDecorators/g,{raw:true})?.exports
// the other module `UsernamePatch` was some random default react component. 
// this is one way I could fix it /shrug

let CakeDayInstance = null;
let birthdaySet = ""; // Global variable

class CakeDay {
  savedBirthdays = SettingConfig.get("birthdays") || {};

  checkBirthday(Author: { id: string }): boolean {
    const Today = new Date();
    if (this.savedBirthdays[Author?.id]) {
      const [MonthStr, DayStr] = (this.savedBirthdays[Author?.id] ?? "").split("/");
      const [Month, Day] = [parseInt(MonthStr, 10), parseInt(DayStr, 10)];

      return (
        (Today.getMonth() + 1 === Month && Today.getDate() === Day) ||
        (Today.getMonth() + 1 === Day && Today.getDate() === Month)
      );
    }

    return false;
  }

  start() {
    const Tree: { default: () => string } = webpack.getByProps("UsernameDecorationTypes"); // webpack.getBySource(".roleDot", { raw: true });
    // const ProfileNamePatch = webpack.getByProps("CopiableField")

    /*inject.after(ProfileNamePatch, "CopiableField", (args: object, b) => {
      const UserTagCheck: any = util.findInTree(
        args as Record<string, unknown>,
        (x) => x?.copyMetaData === "User Tag",
      );
      const filterFunction: TreeFilter = (x: Record<string, unknown>) => Boolean(x?.user);
      const Author: any = util.findInTree(args as Record<string, unknown>, filterFunction)?.user;
      if (!UserTagCheck) return;
      if (!this.checkBirthday(Author)) return;
      console.log(b)
      b?.props?.children?.props?.children?.[0]?.props?.children?.props?.children?.unshift(
        <ModalList.Tooltip text="It's my birthday!">
          {(data: any) => (
            <button
              {...data}
              className="discord-cake-day-message-cake"
              onClick={() => this.birthdayModal(Author)}
            />
          )}
        </ModalList.Tooltip>,
      );
    });*/

    inject.after(Tree, "default", (OwO: object, props: { props }) => {
      const Author = OwO[0]?.message?.author;
      const ChildrenOf6 = util.findInTree(props, (x) => Boolean(x?.children));
      const Decorations = ChildrenOf6.children[3]?.props?.children; // how do I do this based off findInTree ??
      if (this.checkBirthday(Author)) {
        Decorations?.push(
          <ModalList.Tooltip text="It's my birthday!">
            {(data: any) => (
              <button
                {...data}
                className="discord-cake-day-message-cake"
                onClick={() => this.birthdayModal(Author)}
              />
            )}
          </ModalList.Tooltip>,
        );
      }

      const TargetChild = props.props?.children[3]?.props;
      if (TargetChild) {
        TargetChild.children = Decorations || TargetChild.children;
      }
    });

    inject.after(UsernamePatch, "default", (OwO: object, props: { props }) => {
      const User = util.findInReactTree(props, (x) => Boolean(x?.user))?.user;
      const Children = util.findInReactTree(props, (x) => x?.className?.includes("name"));
      if (this.checkBirthday(User)) {
        Children?.children?.push(
          <ModalList.Tooltip text="It's my birthday!">
            {(data: any) => <button {...data} className="discord-cake-day-message-cake" />}
          </ModalList.Tooltip>,
        );
      }
    });

    inject.utils.addMenuItem("user-context" as ContextMenuTypes, (data) => (
      <>
        <MenuItem label="Birthday" id={"add-birthday-owo-stuff-submenu"}>
          <MenuItem
            id="add-birthday"
            label="Set Birthday"
            action={() => this.birthdayModal(data.user as UserData)}
          />
          <MenuItem
            id="remove-birthday"
            label="Clear Birthday"
            action={() => this.clearBirthday(data.user as UserData)}
          />
        </MenuItem>
      </>
    ));
  }

  clearBirthday(user: { username: string; id: string }) {
    if (!(user.id in this.savedBirthdays)) {
      return;
    }
    delete this.savedBirthdays[user.id];
    SettingConfig.set("birthdays", this.savedBirthdays);
    toast("Cleared Birthday", SUCCESS);
  }

  isValidBirthday(birthday: string) {
    const pattern =
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$|^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
    // hehe. regex go BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    return pattern.test(birthday);
  }

  birthdayModal(_user: { username: string; id: string }) {
    const user = _user;
    modal.openModal((props) => (
      <ModalList.ConfirmModal
        {...props}
        header={`Set ${user.username}'s birthday`}
        confirmButtonColor={BLUE}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={() => {
          if (this.isValidBirthday(birthdaySet)) {
            toast("Set Birthday!", SUCCESS);
            this.savedBirthdays[user.id] = birthdaySet;
            SettingConfig.set("birthdays", this.savedBirthdays);
            logger.log("Config: ", SettingConfig.get("birthdays"));
          } else {
            toast("Not a valid birthday!", FAILURE);
          }
        }}>
        <ModalList.TextInput
          placeholder="Enter date. (e.g.. MM/DD || DD/MM)"
          onChange={(v: string) => {
            birthdaySet = v;
          }}
        />
      </ModalList.ConfirmModal>
    ));
  }
}

export async function start() {
  CakeDayInstance = new CakeDay();
  CakeDayInstance.start();
}

export function Settings() {
  const { savedBirthdays } = CakeDayInstance;

  const userRows = [];
  for (const userId in savedBirthdays) {
    if (savedBirthdays.hasOwnProperty(userId)) {
      const user = users.getUser(
        userId,
      ) as UserType;
      const birthday = savedBirthdays[userId];

      if (user) {
        userRows.push(
          <>
            <span style={{ color: "white", marginLeft: "20px" }}>Birthday: {birthday}</span>
            <FriendRow
              user={user}
              activities={[]}
              type={1}
              status={PresenceStore.getStatus(user.id)}
            />
          </>,
        );
      }
    }
  }

  return <div className="cake-day-settings">{userRows}</div>;
}

export function stop() {
  inject.uninjectAll();
}
