import { settings } from "replugged";
const Regex = new RegExp(/\d+/g);
export const owo = await settings.init("dev.kaan.reminders");
export function formatFilename(filename: string): string {
  const BananaSplit = filename.replace(".mp3", "").replaceAll("_", " ").replaceAll("-", " ");
  const SomeStuffHere = BananaSplit.split(" ");
  const CAPSSSSSSSSSSSSSSSS = SomeStuffHere.map(
    (word) => word.replaceAll(Regex, "").charAt(0).toUpperCase() + word.slice(1), // why does this not replace the numbers with an empty string
  );
  const ItLooksRightNowOwO = CAPSSSSSSSSSSSSSSSS.join(" ");
  return ItLooksRightNowOwO;
}
