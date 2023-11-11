import { Injector, common, webpack, util } from "replugged";

const { React } = common;
const inject = new Injector();

const ProfileContext = webpack.getByProps('UserProfileContext');
const UserProfileStore = webpack.getByStoreName("UserProfileStore")
const ConnectedUserAccount = webpack.getByProps("ConnectedUserAccount").ConnectedUserAccount;

export async function start(): Promise<void> {
  inject.after(ProfileContext, "default", (a, b, c) => {
    const Connections = UserProfileStore.getUserProfile(a[0].user.id)
      ?.connectedAccounts;
    if (Connections) {
      const Dropdown = util.findInTree(a, x => x?.type && x?.props && x?.props?.className?.includes('mutualGuildsList'), { walkable: ['props', 'children'] }).type
      if (Dropdown) {
        const options = Object.keys(Connections).map((key) => ({
          label: key,
          value: Connections[key],
        }));

        if (options.length > 0) {
          const buttons = options.map((option, index) => (
            <ConnectedUserAccount
              connectedAccount={option.value}
              theme="dark"
              userId={null}
              key={index}>
              {option.label}
            </ConnectedUserAccount>
          ));

          const dropdownContent = (
            <Dropdown
              header={`${options.length > 1 && options.length !== 0
                ? `${options.length} Connections`
                : "1 Connection"
                }`}>
              <div>{buttons}</div>
            </Dropdown>
          );
          const Tree = util.findInTree(a, x => x?.className?.includes?.('Panel'), { walkable: ['props', 'children'] })
          Tree.children?.push(
            dropdownContent,
          );
        }
      }
    }
  });
}

export function stop(): void {
  inject.uninjectAll();
}
