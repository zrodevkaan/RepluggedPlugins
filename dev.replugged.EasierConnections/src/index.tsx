/* eslint-disable require-await */
/* eslint-disable prefer-destructuring */
import { Injector, common, webpack } from "replugged";

const { React } = common;
const inject = new Injector();

const ProfileContext = webpack.getModule(x => x?.exports?.UserProfileContext);
const ConnectedUserAccount = webpack.getByProps('ConnectedUserAccount').ConnectedUserAccount;

export async function start(): Promise<void> {
  inject.after(ProfileContext, 'default', (a, b, c) => {
    const Connections = webpack.getByStoreName("UserProfileStore").getUserProfile(a[0].user.id)?.connectedAccounts;
    if (Connections) {
      const Dropdown = a?.[0]?.children?.[1]?.props?.children?.[3]?.props?.children?.[0]?.type;
      if (Dropdown) {
        const options = Object.keys(Connections).map(key => ({
          label: key, // Set the label to the connection key
          value: Connections[key], // Set the value to the connection data (if needed not sure xD)
        }));

        if (options.length > 0) { // Check if there are connections. 
          const buttons = options.map((option, index) => (
            <ConnectedUserAccount
              connectedAccount={option.value}
              theme='dark'
              userId={null} // Replace with the actual userId + this isnt needed but funny
              key={index} // Commenting this cause no one is gonna have fun figuring out how this works
            >
              {option.label}
            </ConnectedUserAccount>
          ));

          b?.props?.children?.props?.children?.props?.children[1]?.props?.children[3]?.props?.children?.push(
            <Dropdown header={`${options.length > 1 && options.length !== 0 ? `${options.length} Connections` : '1 Connection'}`}>
              {buttons}
            </Dropdown>
          );
        }
      }
    }
  });
}

export function stop(): void {
  inject.uninjectAll();
}
