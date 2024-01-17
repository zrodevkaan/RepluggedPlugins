import { Logger, webpack } from "replugged";

export const logger = Logger.plugin("Reminders", "Cyan");

// this is the most effective way I found to get Icon react components
export const Icons: Array<any> = Object.values(
  webpack
    .getBySource("Icon", { all: true })
    .filter((item) => Object.values(item).some((value) => typeof value === "function")),
);

export function findIconFromName(iconName: string): () => {} {
  // I know this isnt needed at all but.... funny :3
  for (const icon of Icons) {
    if (Object.entries(icon)[0][0] === iconName) {
      logger.log(`Found React Component: "${iconName}".`);
      return Object.entries(icon)[0][1] as () => {}; // How do I define a function as a type ??
      // im not using an interface.
    }
  }
  logger.error(`Could not find the React Component: "${iconName}". Defaulted to "EducationIcon".`);
  return Icons.find((x) => x.EducationIcon).EducationIcon;
}
