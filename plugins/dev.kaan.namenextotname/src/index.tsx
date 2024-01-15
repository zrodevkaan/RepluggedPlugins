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

const ModalList: any = webpack.getByProps("ConfirmModal");

const { SwitchItem } = components;

const { copy } = (
  await webpack.waitForModule<{ default: { copy: (yes: string) => unknown } }>(
    webpack.filters.byProps("copy"),
  )
).default;

const NameWithRole: any = webpack.getByProps("UsernameDecorationTypes");

const inject = new Injector();

const DisplayName = ({ username, discriminator, startCopy, color }) => {
  // this now exists.
  // please make it easier on yourself with your next plugin.
  // exporting this stuff and MAKING it organized.
  const displayDiscriminator = discriminator && discriminator !== "0" ? `#${discriminator}` : "";

  const handleCopy = () => {
    const copyText = discriminator ? `@${username}${displayDiscriminator}` : `@${username}`;
    startCopy(copyText);
  };

  return (
    // Why did ppl question `text`. It does the same thing as span >:(
    <ModalList.Tooltip text="Copy username">
      {(data: any) => (
        <text
          {...data}
          style={{ userSelect: "none", color, cursor: "pointer" }}
          onClick={handleCopy}>
          {` @${username}${displayDiscriminator}`}
        </text>
      )}
    </ModalList.Tooltip>
  );
};

// I like async, lint doesn't. I dont care :3
export async function start() {
  inject.after(NameWithRole, "default", (a: any) => {
    const iHateTS: (tree: Record<string, unknown>) => boolean = (x) => Boolean(x?.decorations);
    const Decorations = util.findInReactTree(a, iHateTS).decorations[1];
    const filterFunction: (tree: Record<string, unknown>) => boolean = (x) => Boolean(x?.username);
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

      Decorations?.splice(2, 0, displayName);
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
