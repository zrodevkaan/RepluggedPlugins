import {Injector, Logger, webpack} from "replugged";

export const injector = new Injector();
export const logger = Logger.plugin("InAppStore");
export const ComponentsPack: any = webpack.getByProps("TabBar");
type KeyValue = [string, any];

export function turnObjectIntoArray(object: Record<string, any>): KeyValue[] | null {
  if (!object || typeof object !== "object" || Array.isArray(object)) {
    console.error("Invalid input. Expected a non-null object.");
    return null;
  }

  try {
    return Object.keys(object).map((key: string): KeyValue => {
      return [key, object[key]];
    });
  } catch (error) {
    console.error("An error occurred while converting object to array.", error);
    return null;
  }
}
