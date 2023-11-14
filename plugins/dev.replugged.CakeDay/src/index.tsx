import {Injector, Logger, common, components, settings, webpack, util} from "replugged";

const {ContextMenu: {MenuItem, ItemColors}} = components;
const {React, modal, toast: {Kind: {FAILURE, SUCCESS}, toast}} = common;
import "./styles.css";
import {ContextMenuTypes} from "replugged/types";
import {User} from "discord-types/general";
import {resolveObjectURL} from "buffer";

const SettingConfig = await settings.init("CakeDay");

const inject = new Injector();
const logger = Logger.plugin("CakeDay");
const ModalList: object = webpack.getByProps("ConfirmModal");
const FriendRow: object = webpack.getBySource("isActiveRow:!1");
const PresenceStore: object = webpack.getByStoreName('PresenceStore');

let CakeDayInstance = null;
let birthdaySet = ""; // Global variable

class CakeDay {
    savedBirthdays = SettingConfig.get("birthdays") || {};

    checkBirthday(Author: { id: string }) {
        const Today = new Date();
        if (this.savedBirthdays[Author?.id]) {
            const [MonthStr, DayStr] = this.savedBirthdays[Author?.id]?.split("/");
            const [Month, Day] = [parseInt(MonthStr, 10), parseInt(DayStr, 10)];

            return (
                (Today.getMonth() + 1 === Month && Today.getDate() === Day) ||
                (Today.getDate() === Month && Today.getMonth() + 1 === Day)
            );
        }
    }

    start() {
        const Tree = webpack.getBySource(".roleDot", {raw: true});
        const NamePatch = webpack.getModule(x => x?.exports?.CloseButton)
        const ProfileNamePatch = webpack.getBySource(`n(i.section`, {raw: true})?.exports

        inject.after(ProfileNamePatch, 'default', (args: object, b, c) => {
            const UserTagCheck: string = util.findInTree(args, x => x?.copyMetaData === "User Tag")
            const Author: object = util.findInTree(args, x => x?.user)?.user
            if (!UserTagCheck) return
            if (!this.checkBirthday(Author)) return;
            b?.props?.children?.props?.children?.[0]?.props?.children?.props?.children?.push(
                <ModalList.Tooltip text="It's my birthday!">
                    {(data) => (
                        <button
                            {...data}
                            className="discord-cake-day-message-cake"
                            onClick={() => this.BirthdayModal(Author)}
                        />
                    )}
                </ModalList.Tooltip>,
            )
        })

        inject.after(Tree?.exports, "default", (OwO: object, props) => {
            const Author = OwO[0]?.message?.author;
            const Decorations = props?.props?.children[3]?.props?.children;

            if (this.checkBirthday(Author)) {
                Decorations?.push(
                    <ModalList.Tooltip text="It's my birthday!">
                        {(data) => (
                            <button
                                {...data}
                                className="discord-cake-day-message-cake"
                                onClick={() => this.BirthdayModal(Author)}
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

        inject.utils.addMenuItem("user-context" as ContextMenuTypes, (data) => (
            <>
                <MenuItem
                    id="add-birthday"
                    label="Set Birthday"
                    action={() => this.BirthdayModal(data.user)}
                />
                <MenuItem
                    id="remove-birthday"
                    label="Clear Birthday"
                    action={() => this.ClearBirthday(data.user)}
                />
            </>
        ));
    }

    ClearBirthday(user: { username: string, id: string }) {
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

    BirthdayModal(_user: { username: string, id: string }) {
        const user = _user;
        modal.openModal((props) => (
            <ModalList.ConfirmModal
                {...props}
                header={`Set ${user.username}'s birthday`}
                confirmButtonColor={ItemColors.BRAND}
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
                    onChange={(v: string) => (birthdaySet = v)}
                />
            </ModalList.ConfirmModal>
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
            const user = webpack.getByStoreName("UserStore").getUser(userId);
            const birthday = savedBirthdays[userId];

            if (user) {
                userRows.push(
                    <><span style={{color: "white", marginLeft: "20px"}}>Birthday: {birthday}</span><FriendRow
                        user={user} activities={[]} type={1} status={PresenceStore.getStatus(user.id)}/></>
                );
            }
        }
    }

    return <div className="cake-day-settings">{userRows}</div>;
}

export function stop() {
    inject.uninjectAll();
}
