import { Injector, settings, util, webpack } from "replugged";
import { React } from "replugged/common";
import { SwitchItem, Text } from "replugged/components";
import "./styles.css"
export interface SettingsType {
  roleColor?: boolean;
}

const owo = await settings.init<SettingsType>("dev.kaan.identitytag");

const UsernameDecoration = webpack.getByProps<{ default: any; UsernameDecorationTypes: {} }>("UsernameDecorationTypes");

const { CopiableField } = webpack.getByProps<{ CopiableField: any }>("CopiableField");
const inject = new Injector();


const DisplayName = React.memo(({ username, color }) => {
  return (

    <CopiableField
      className="identityTag"
      copyMetaData="User Tag"
      copyValue={username.replace("@", "")}
      disableCopy={false}
      showCopyIcon={true}>
      <Text.Normal color={color} className="identityTag-Username">{username}</Text.Normal>
    </CopiableField>
  );
});

// I like async, lint doesn't. I dont care :3
export function start() {
  inject.after(UsernameDecoration, "default", ([props]: [props: any], res) => {

    const usernameIndex = res?.props?.children?.findIndex(c => c?.props?.onRequestClose?.toString()?.toLowerCase()?.includes("usernameprofile"));
    const user = props?.message?.author;
    const updatedColorCauseUpdated = owo.get("roleColor", false)
      ? props?.author?.colorString
      : "";
    if (user) {
      const discriminator = user.discriminator && user.discriminator !== "0";
      const displayName = (
        <DisplayName
          username={discriminator ? `${user.username}#${user.discriminator}` : `@${user.username}`}
          color={updatedColorCauseUpdated}
        />
      );

      res?.props?.children?.splice(usernameIndex + 1, 0, displayName);
    }

  });
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

export function stop() {
  inject.uninjectAll();
}
