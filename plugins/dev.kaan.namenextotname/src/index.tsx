import { Injector, common, components, settings, util, webpack } from "replugged";

const {
  React,
  toast: {
    Kind: { SUCCESS },
    toast,
  },
} = common;

export interface SettingsType {
  roleColor?: boolean;
}

const owo = await settings.init<SettingsType>("dev.kaan.identitytag");

const { SwitchItem } = components;

const { copy } = (
  await webpack.waitForModule<{ default: { copy: (yes: string) => unknown } }>(
    webpack.filters.byProps("copy"),
  )
).default;

const NameWithRole = await webpack.waitForModule<{ H: (something: string) => unknown }>(
  webpack.filters.byProps("NameWithRole"),
);

const inject = new Injector();

const DisplayName = ({ username, discriminator, startCopy, color }) => {
  // this now exists.
  // please make it easier on yourself with your next plugin.
  // exporting this stuff and MAKING it organized.
  const displayDiscriminator = discriminator && discriminator !== "0" ? `#${discriminator}` : "";
  return (
    // Why did ppl question `text`. It does the same thing as span >:(
    <text
      style={{ userSelect: "none", color }}
      onClick={() => startCopy(username)}>{` @${username}${displayDiscriminator}`}</text>
  );
};

// I like async, lint doesn't. I dont care :3
export async function start() {
  inject.after(NameWithRole, "H", (a: any) => {
    const nameHolder = a[0]?.children;
    const className: string = a[0]?.className;

    if (className?.includes("header")) {
      const childrenArray = nameHolder[2]?.props?.children?.props?.children as Array<any>;
      const filterFunction: (tree: Record<string, unknown>) => boolean = (x) =>
        Boolean(x?.username);
      const textColorMaybeOwO: (tree: Record<string, unknown>) => boolean = (x) =>
        Boolean(x?.colorString); // albrt suggested this so sure.

      const actualUsername = util.findInTree(a, filterFunction);
      const actualTextColor = util.findInTree(a, textColorMaybeOwO);
      const updatedColorCauseUpdated = owo.get("roleColor", false)
        ? actualTextColor?.colorString
        : "";
      if (actualUsername) {
        const { username, discriminator } = actualUsername;
        const displayName = (
          <DisplayName
            username={username}
            discriminator={discriminator}
            startCopy={startCopy}
            color={updatedColorCauseUpdated}
          />
        );

        childrenArray?.splice(2, 0, displayName);
      }
    }
  });

  function startCopy(text: string) {
    copy(text);
    toast("Copied username to clipboard!", SUCCESS);
  }
}

export function Settings() {
  // const [isColored, setIsColored] = React.useState(true);
  // I thought this was needed :(

  return (
    <div>
      <SwitchItem
        {...util.useSetting(owo, "roleColor", false)}
        note={"Will make it so the text of the user is the color of the users role"}>
        Role Color
      </SwitchItem>
    </div>
  );
}

export async function stop() {
  inject.uninjectAll();
}
