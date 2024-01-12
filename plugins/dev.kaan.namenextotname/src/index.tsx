import { Injector, common, webpack, util } from "replugged";

const {
  React,
  toast: {
    Kind: { SUCCESS },
    toast,
  },
} = common;

const { copy } = webpack.getByProps("copy");
const NameWithRole = webpack.getByProps("NameWithRole");
const inject = new Injector();

export async function start() {
  inject.after(NameWithRole, "H", (a: any[]) => {
    const nameHolder = a[0]?.children;
    const className: string = a[0]?.className;

    if (className?.includes("header")) {
      const childrenArray = (nameHolder[2]?.props?.children?.props?.children as Array<any>);
      const actualUsername = util.findInTree(a, x => x?.username);

      if (actualUsername) {
        const { username, discriminator } = actualUsername;
        const displayDiscriminator = discriminator && discriminator !== "0" ? `#${discriminator}` : '';
        const displayName = (
          <text onClick={() => startCopy((username as string))}>{` @${username}${displayDiscriminator}`}</text>
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

export function stop() {
  inject.uninjectAll();
}
