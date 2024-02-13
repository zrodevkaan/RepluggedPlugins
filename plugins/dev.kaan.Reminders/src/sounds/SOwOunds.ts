import {owo} from "../comps/Settings";

const SoundDeclare =
  "https://github.com/zrodevkaan/RepluggedPlugins/raw/main/plugins/dev.kaan.Reminders/src/sounds/";

export function playSound(reminderName: string): Promise<void> {
  if (didUserEnableCustomAlertsOwO()) {
    return playCustomSound(owo.get("reminderCustomSound"));
  }
  const pp = new Audio(`${SoundDeclare}${reminderName}`).play();
  return pp;
}

export function playCustomSound(path: string): Promise<void> {
  return new Audio(`${path}`).play();
}

export function getSound(): string {
  if (didUserEnableCustomAlertsOwO()) {
    void playCustomSound(owo.get("reminderCustomSound"));
    return;
  }
  return owo.get("reminderSound"); // idk why I use owo for basically everything.
}

export function didUserEnableCustomAlertsOwO(): boolean {
  return owo.get("reminderUseCustomAlert");
}
