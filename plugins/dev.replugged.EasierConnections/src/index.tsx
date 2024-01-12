import { Injector, common, util, webpack } from "replugged";

interface UserProfileStoreType {
  getUserProfile: (userId: string) => any;
}
interface ConnectedUserAccountStuffBruh {
  ConnectedUserAccount: any;
}
interface UserProfile {
  user: {
    id: string;
  };
}
interface ThereHasToBeABetterWayToDoThis {
  className?: string;
}
interface TreeNode {
  children?: {
    push: (item: any) => void;
  };
}

const { React } = common;
const inject = new Injector();

const ProfileContext = await webpack.waitForModule<{ default: (something: string) => unknown }>(
  webpack.filters.byProps("UserProfileContext"),
);
const UserProfileStore = webpack.getByStoreName(
  "UserProfileStore",
) as unknown as UserProfileStoreType;

const { ConnectedUserAccount } = webpack.getByProps(
  "ConnectedUserAccount",
) as ConnectedUserAccountStuffBruh;

export async function start(): Promise<void> {
  inject.before(ProfileContext, "default", (a: UserProfile[]) => {
    const Connections = UserProfileStore.getUserProfile(a[0].user.id)?.connectedAccounts;
    if (Connections) {
      const Dropdown = util.findInTree(
        a?.[0] as object as Record<string, unknown>,
        (x: ThereHasToBeABetterWayToDoThis) => x?.className?.includes("profilePanelConnections"),
      )?.children?.[0]?.type; // a?.[0]?.children?.[1]?.props?.children?.[3]?.props?.children?.[0]?.type; Outdated since... whenever..
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
            <Dropdown header={`${options.length} Connection${options.length > 1 ? "s" : ""}`}>
              <div>{buttons}</div>
            </Dropdown>
          );
          const Tree: TreeNode = util.findInTree(
            a?.[0] as unknown as Record<string, unknown>,
            (x: ThereHasToBeABetterWayToDoThis) => x?.className?.includes?.("Panel"),
            {
              maxRecursion: Infinity, // ifninty
              walkable: ["props", "children"],
            },
          );
          if (Tree) {
            Tree?.children?.push(dropdownContent);
          }
        }
      }
    }
  });
}

export function stop(): void {
  inject.uninjectAll();
}
