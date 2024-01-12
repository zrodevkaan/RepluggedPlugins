import { Injector, common, util, webpack } from "replugged";

const {
  React,
  toast: {
    Kind: { SUCCESS },
    toast,
  },
} = common;

const copy = await webpack.waitForModule<{ default: { copy: (text: string) => {} } }>(
  webpack.filters.byProps("copy"),
);
const NameWithRole = await webpack.waitForModule<{ H: (something: string) => unknown }>(
  webpack.filters.byProps("NameWithRole"),
);
const inject = new Injector();

export async function start() {
  inject.after(NameWithRole, "H", (a: any[]) => {
    const nameHolder = a[0]?.children;
    const className: string = a[0]?.className;

    if (className?.includes("header")) {
      const childrenArray = nameHolder[2]?.props?.children?.props?.children as Array<any>;
      const actualUsername = util.findInTree(a, (x) => x?.username);

      if (actualUsername) {
        const { username, discriminator } = actualUsername;
        const displayDiscriminator =
          discriminator && discriminator !== "0" ? `#${discriminator}` : "";
        const displayName = (
          <text
            onClick={() =>
              startCopy(username as string)
            }>{` @${username}${displayDiscriminator}`}</text>
        );

        childrenArray?.splice(2, 0, displayName);
      }
    }
  });

  function startCopy(text: string) {
    copy?.default?.copy(text);
    toast("Copied username to clipboard!", SUCCESS);
  }
}

export function stop() {
  inject.uninjectAll();
}
