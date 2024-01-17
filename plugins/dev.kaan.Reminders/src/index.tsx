import { Injector, common, settings, webpack } from "replugged";
import HBCM from "./comps/HomeButtonContextMenuApi";
import { ReminderMenu } from "./comps/ReminderMenu";
import { logger } from "./comps/Icons";

const inject = new Injector();
const Colors: any = webpack.getByProps("colorBrand");
const ModalList: any = webpack.getByProps("ConfirmModal");
const { React, modal } = common;

const owo = await settings.init("dev.kaan.reminders");

let reminderTimeout: NodeJS.Timeout | null = null;

export function start() {
  HBCM.addItem("Reminders", ReminderMenu);
}

export function remindersModal() {
  const RenderThis = (props) => {
    const [reminderText, setReminderText] = React.useState("");
    const [reminderMessage, setReminderMessage] = React.useState("");

    const startReminder = (minutes: number | undefined) => {
      const currentReminders = owo.get("reminders") || [];

      reminderTimeout = setTimeout(
        () => {
          logger.log(`Reminder Alert: ${reminderText} ${reminderMessage}`);
          const newReminder = { reminderText, reminderMessage };
          currentReminders.push(newReminder);
          owo.set("reminders", currentReminders);
          reminderTimeout = null;
        },
        minutes * 60 * 1000,
      );
    };

    return (
      <ModalList.ConfirmModal
        {...props}
        header={`⏱️ Add Reminder`}
        confirmButtonColor={Colors.colorBrand}
        confirmText="Add Remind"
        cancelText="Cancel"
        onConfirm={() => {
          startReminder(Number(reminderText));
        }}>
        <ModalList.FormTitle>Message</ModalList.FormTitle>

        <ModalList.TextInput
          placeholder="Feed the dogs."
          value={reminderMessage}
          onChange={(e: string) => {
            setReminderMessage(e);
          }}
        />

        <ModalList.FormTitle>Time</ModalList.FormTitle>

        <ModalList.TextInput
          placeholder="1 (Minutes)"
          value={reminderText}
          onChange={(e: number) => {
            setReminderText(e);
          }}
        />
      </ModalList.ConfirmModal>
    );
  };

  modal.openModal((props) => <RenderThis {...props} />);
}

export function stop(): void {
  if (reminderTimeout != null) {
    clearTimeout(reminderTimeout);
  }
  HBCM.removeItem("Reminders");
  inject.uninjectAll();
}
