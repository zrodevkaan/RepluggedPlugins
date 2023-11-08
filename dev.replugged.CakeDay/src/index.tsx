/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable new-cap */
/* eslint-disable no-invalid-this */
/* eslint-disable require-await */
import { Injector, Logger, common, components, settings, webpack } from "replugged";
const { ContextMenu: { MenuItem } } = components;

const { React } = common;
const DataConfig = await settings.init("CakeDay");
const inject = new Injector();
const logger = Logger.plugin("CakeDay");
const ModalList = webpack.getModule((x) => x?.exports?.ConfirmModal);
let birthdaySet: string = ""; // global. yeah...

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
      <MenuItem
        id="add-birthday"
        label="Set Birthday"
        action={() => this.BirthdayModal(data.user)}
      />
    ));
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

  BirthdayModal(user) {
    webpack.getModule((x) => x?.exports?.openModal).openModal((props) => ( // yeah yeah ik. its exported but i dont care. couldnt figure it out.
      common.React.createElement(
        "div",
        {},
        common.React.createElement(ModalList.ConfirmModal, Object.assign({
          header: `Set ${user.username}'s birthday`,
          confirmButtonColor: webpack.getByProps('colorBrand').colorBrand,
          confirmText: "Confirm",
          cancelText: 'Clear',
          onConfirm: () => {
            if (this.isValidBirthday(birthdaySet)) {
              this.showCustomToast('Set Birthday!', 1);
              this.savedBirthdays[user.id] = birthdaySet;
              DataConfig.set('birthdays', this.savedBirthdays);
              logger.log("Config: " + DataConfig.get('birthdays'))
            } else {
              this.showCustomToast('Not a valid birthday!', 2);
            }
          },
          ...props,
        }),
          common.React.createElement("div", {}, common.React.createElement(ModalList.TextInput, { placeholder: "Enter date.", onChange: (v) => { birthdaySet = v } }))
        )
      )
    ));
  }
}

export async function start() {
  const CakeDayInstance = new CakeDay();
  CakeDayInstance.start();
}

export function Settings(): React.ReactElement { // I haven't tested this. Replugged has a breadcrumb error.
  const rows = [];
  for (const userId in this.savedBirthdays) {
    if (this.savedBirthdays.hasOwnProperty(userId)) {
      const birthday = this.savedBirthdays[userId];
      const user = webpack.getByStoreName('UserStore').getUser(userId)
      if (user) {
        const profileLink = React.createElement(
          "img",
          {
            className: "cake-day-profile",
            src: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            alt: user.username,
          }
        );
        rows.push(
          React.createElement(
            "tr",
            { key: userId, "data-user-id": userId },
            React.createElement("td", null, profileLink),
            React.createElement("td", null, user.username),
            React.createElement("td", null, birthday),
            React.createElement(
              "td",
              null,
              React.createElement(
                "button",
                {
                  onClick: () => {
                    this.clearBirthday(user);
                  },
                  className: "clear-birthday-button bd-button button-ejjZWC lookFilled-1H2Jvj colorBrand-2M3O3N sizeMedium-2oH5mg grow-2T4nbg"
                },
                "Clear Birthday"
              )
            )
          )
        );
      }
    }
  }

  return (
    <div className="cake-day-settings">
      <table className="cake-day-table">
        <thead>
          <tr>
            <th>Profile Picture</th>
            <th>Name</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function stop() {
  inject.uninjectAll();
}
