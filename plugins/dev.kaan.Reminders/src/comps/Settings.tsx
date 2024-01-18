import { settings } from "replugged";

export const owo = await settings.init("dev.kaan.reminders");
export function formatFilename(filename: string): string {
  const BananaSplit = filename.replace(".mp3", "").replaceAll("_", " ").replaceAll("-", " ");
  const SomeStuffHere = BananaSplit.split(" ");
  const CAPSSSSSSSSSSSSSSSS = SomeStuffHere.map(
    (word) => word.replace(/\d/g, "").charAt(0).toUpperCase() + word.slice(1), // why does this not replace the numbers with an empty string
  );
  const ItLooksRightNowOwO = CAPSSSSSSSSSSSSSSSS.join(" ");
  return ItLooksRightNowOwO;
}
