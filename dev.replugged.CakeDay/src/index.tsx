/* eslint-disable no-return-assign */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
/* eslint-disable require-await */
import { Injector, Logger, common, components, settings, webpack } from "replugged";
const { ContextMenu: { MenuItem } } = components;
const { React, modal } = common;

const DataConfig = await settings.init("CakeDay");

const inject = new Injector();
const logger = Logger.plugin("CakeDay");
const ModalList = webpack.getModule((x) => x?.exports?.ConfirmModal);
const { colorBrand } = webpack.getByProps('colorBrand');
const FriendRow = webpack.getBySource("isActiveRow:!1");
const { colorDanger } = webpack.getByProps("colorDanger", "colorPremium");


let CakeDayInstance = null;
let birthdaySet = ""; // Global variable

class CakeDay {
  savedBirthdays = DataConfig.get('birthdays') || {};

  start() {
    const Tooltip = webpack.getModule((x) => x?.exports?.Tooltip)?.Tooltip || components.Tooltip;
    const Tree = webpack.getBySource(".roleDot", { raw: true });

    inject.after(Tree?.exports, "default", (OwO, props) => {
      const Author = OwO[0]?.message?.author;
      const Decorations = props?.props?.children[3]?.props?.children;

      if (Author?.id in this.savedBirthdays) {
        const Today = new Date();
        const [MonthStr, DayStr] = this.savedBirthdays[Author.id].split("/");

        const [Month, Day] = [parseInt(MonthStr, 10), parseInt(DayStr, 10)];

        if ((Today.getMonth() + 1 === Month && Today.getDate() === Day) ||
          (Today.getDate() === Month && Today.getMonth() + 1 === Day)) {
          Decorations?.push(
            <Tooltip text="It's my birthday!">
              {(data) => (
                <button
                  {...data}
                  className="discord-cake-day-message-cake"
                  onClick={() => this.BirthdayModal(Author)}
                />
              )}
            </Tooltip>
          );
        }

      }

      const TargetChild = props.props?.children[3]?.props;
      if (TargetChild) {
        TargetChild.children = Decorations || TargetChild.children;
      }
    });

    inject.utils.addMenuItem('user-context', (data) => (
      <><MenuItem
        id="add-birthday"
        label="Set Birthday"
        action={() => this.BirthdayModal(data.user)}
      /><MenuItem
          id="remove-birthday"
          label="Clear Birthday"
          className={colorDanger}
          action={() => this.clearBirthday(data.user)}
        /></>
    ));
  }

  clearBirthday(user) {
    if (user.id in this.savedBirthdays) {
      delete this.savedBirthdays[user.id];
      DataConfig.set('birthdays', this.savedBirthdays);
      this.showCustomToast('Cleared Birthday', 1);
    }
  }

  isValidBirthday(birthday) {
    const pattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$|^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
    // hehe. regex go BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    return pattern.test(birthday);
  }

  showCustomToast(message, type) { // is this exported?
    const showToast = webpack.getModule((x) => x?.exports?.showToast).showToast;
    const { createToast } = webpack.getModule((x) => x?.exports?.createToast);
    showToast(createToast(message, type));
  }

  BirthdayModal(_user) {
    const user = _user
    modal.openModal((props) => (
      <div>
        <ModalList.ConfirmModal
          {...props}
          header={`Set ${user.username}'s birthday`}
          confirmButtonColor={colorBrand}
          confirmText="Confirm"
          cancelText="Clear"
          onConfirm={() => {
            if (this.isValidBirthday(birthdaySet)) {
              this.showCustomToast('Set Birthday!', 1);
              this.savedBirthdays[user.id] = birthdaySet;
              DataConfig.set('birthdays', this.savedBirthdays);
              logger.log("Config: " + DataConfig.get('birthdays'));
            } else {
              this.showCustomToast('Not a valid birthday!', 2);
            }
          }}
        >
          <div>
            <ModalList.TextInput
              placeholder="Enter date."
              onChange={(v: string) => birthdaySet = v}
            />
          </div>
        </ModalList.ConfirmModal>
      </div>
    ));
  }

}

export async function start() {
  CakeDayInstance = new CakeDay();
  CakeDayInstance.start();
}

export function Settings(): React.ReactElement {
  const savedBirthdays = CakeDayInstance.savedBirthdays;

  const userRows = [];
  for (const userId in savedBirthdays) {
    if (savedBirthdays.hasOwnProperty(userId)) {
      const birthday = savedBirthdays[userId];
      const user = webpack.getByStoreName('UserStore').getUser(userId);
      if (user) {
        userRows.push(
          <div key={userId} className="user-row">
            <FriendRow
              user={user}
              activities={[]}
              type={1}
              status="dnd"
            />
          </div>
        );
      }
    }
  }

  return (
    <div className="cake-day-settings">
      {userRows}
    </div>
  );
}

export function stop() {
  inject.uninjectAll();
}
