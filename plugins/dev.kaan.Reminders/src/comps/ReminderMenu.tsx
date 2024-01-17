import { ContextMenu } from "replugged/components";
import { remindersModal } from "..";
import { findIconFromName } from "./Icons";

export const ReminderMenu = (
  <ContextMenu.MenuItem
    {...{
      label: "Reminders",
      id: "reminders",
      icon: findIconFromName("BellIcon"),
      action: () => {
        remindersModal();
      },
    }}
  />
);
