import { Injector, common, util, webpack } from "replugged";
import HBCM from "./comps/HomeButtonContextMenuApi";
import { ReminderMenu } from "./comps/ReminderMenu";
import { logger } from "./comps/Icons";
import { FormItem, SelectItem, SwitchItem, Text, TextInput } from "replugged/components";
import { didUserEnableCustomAlertsOwO, getSound, playSound } from "./sounds/SOwOunds";
import { formatFilename, owo } from "./comps/Settings";

const inject = new Injector();
const Colors: any = webpack.getByProps("colorBrand");
const ModalList: any = webpack.getByProps("ConfirmModal");
const { React, modal } = common;

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
          playSound(getSound());
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

export function Settings() {
  const options = [
    { label: "hi_reminder.mp3", value: "hi_reminder.mp3" },
    { label: "hq-explosion-6288.mp3", value: "hq-explosion-6288.mp3" },
    { label: "outlook_reminder.mp3", value: "outlook_reminder.mp3" },
  ];

  return (
    <div>
      <Text.H2 style={{ marginBottom: 20 }}> Reminder Sounds </Text.H2>
      <FormItem>
        <SelectItem
          disabled={didUserEnableCustomAlertsOwO()}
          note="Allows you to use silly sounds for alerts."
          {...util.useSetting(owo, "reminderSound", "outlook_reminder.mp3")}
          options={options.map((option) => ({
            label: formatFilename(option.label),
            value: option.value,
          }))}
        />
      </FormItem>
      <FormItem>
        <SwitchItem
          style={{ marginBottom: 20 }}
          children="Use Custom Alert"
          note="Allows you to use a raw mp3 link for your custom reminder"
          {...util.useSetting(owo, "reminderUseCustomAlert", false)}
          value={didUserEnableCustomAlertsOwO()}
        />
      </FormItem>
      <FormItem>
        <Text.H2 style={{ marginBottom: 20 }}> Custom Alert </Text.H2>
        <TextInput
          style={{ marginBottom: 20 }}
          disabled={!didUserEnableCustomAlertsOwO()}
          {...util.useSetting(owo, "reminderCustomSound", "https://domain.ext")}
          placeholder="https://domain.ext"
        />
      </FormItem>
    </div>
  );
}
