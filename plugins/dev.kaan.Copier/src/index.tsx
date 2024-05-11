import { components, Injector, settings, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { hexToHSL, hexToRGB } from "./helpers";

const {
  ContextMenu: { MenuItem },
} = components;

const injector = new Injector();
const GuildStore = webpack.getByStoreName("GuildStore");
const CurrentGuild = webpack.getByStoreName("SelectedGuildStore");
const UserProfileStore = webpack.getByStoreName("UserProfileStore");
const FetchUtils = webpack.getByProps("fetchProfile");

export const config = await settings.init("dev.kaan.copier");

/*
These dont work lol. my converters suck.
<MenuItem
  id="stern-is-awesome-copier-lab"
  label="Copy LAB Color"
  action={() => {
    copy(hexToLab(data.role.colorString));
  }}
/>
<MenuItem
  id="stern-is-awesome-copier-cmyk"
  label="Copy CMYK Color"
  action={() => {
    copy(hexToCmyk(data.role.colorString));
  }}
/>
 */
const { copy } = DiscordNative.clipboard;

const toPascalCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const isValueEmpty = (value: any) => {
  return (
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    ((value instanceof Set || value instanceof Map) && value.size === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

const copierObjects = (data: any, parentId: string, maxItems: number = 10, depth: number = 0): JSX.Element[] => {
  if (depth >= 100 || depth >= maxItems) {
    console.warn('Recursion depth or maxItems limit exceeded.');
    return [];
  }

  return Object.entries(data || {}).map(([key, value]) => {
    const itemId = `${parentId}-${key}`;
    const isValueNull = isValueEmpty(value);
    return renderMenuItem(key, value, itemId, parentId, isValueNull, maxItems, depth + 1);
  });
};

const renderMenuItem = (key: string, value: any, itemId: string, parentId: string, isValueNull: boolean, maxItems: number, depth: number): JSX.Element => {
  const handleCopy = () => {
    copy(value?.toString() || '');
    console.log(value);
  };
  
  if (Array.isArray(value)) {
    /*const isUsersArray = value.every((item: any) => typeof item === 'object' && item !== null && Object.keys(item).length > 0);
    if (isUsersArray) {
      const userItems = value.map((user: any, index: number) => (
        <MenuItem key={`${itemId}-${index}`} id={`${itemId}-${index}`} label={`${user?.description ? user?.id : user?.username}`} disabled={isValueNull}>
          {copierObjects(user, `${itemId}-${index}`)}
        </MenuItem>
      ));
      return (
        <MenuItem key={itemId} id={itemId} label={toPascalCase(key)} disabled={isValueNull}>
          {userItems}
        </MenuItem>
      );
    }*/
    return (
      <MenuItem key={itemId} id={itemId} label={toPascalCase(key)} disabled={isValueNull}>
        {value.map((item: any, index: number) => (
          <MenuItem key={`${itemId}-${index}`} id={`${itemId}-${index}`} label={`${toPascalCase(key)} ${index}`} disabled={isValueNull}>
            {renderMenuItem(`${key} ${index}`, item, `${itemId}-${index}`, itemId, isValueNull, maxItems, depth + 1)}
          </MenuItem>
        ))}
      </MenuItem>
    );
  } else if (typeof value === 'object' && value !== null) {
    return (
      <MenuItem key={itemId} id={itemId} label={toPascalCase(key)} disabled={isValueNull}>
        {copierObjects(value, itemId, maxItems, depth + 1)}
      </MenuItem>
    );
  } else {
    return (
      <MenuItem
        key={itemId}
        id={itemId}
        label={`Copy ${toPascalCase(key)}`}
        action={handleCopy}
        disabled={isValueNull}
      />
    );
  }
};

const allEnums = [];
for (const key in ContextMenuTypes) {
  if (ContextMenuTypes.hasOwnProperty(key)) {
    const type = ContextMenuTypes[key];
    allEnums.push(type)
  }
}

export function start() {
  injector.utils.addMenuItem(ContextMenuTypes.DevContext, (data: { id: string, role: any }) => {
    data.role = GuildStore.getRole(CurrentGuild.getGuildId(), data?.id);
    return (
      <MenuItem id={"copier-menu"} label="Copier">
        <MenuItem
          id="stern-is-awesome-copier-colors"
          label="Colors"
        >
          <MenuItem
            id="stern-is-awesome-copier-hex"
            label="Copy Hex Color"
            action={() => {
              copy(data.role.colorString);
            }}
          />
          <MenuItem
            id="stern-is-awesome-copier-rgb"
            label="Copy RGB Color"
            action={() => {
              copy(hexToRGB(data.role.colorString));
            }}
          />
          <MenuItem
            id="stern-is-awesome-copier-hsl"
            label="Copy HSL Color"
            action={() => {
              copy(hexToHSL(data.role.colorString));
            }}
          />
        </MenuItem>
        <MenuItem
          id="stern-is-awesome-copier-misc"
          label="Misc"
        >
          <MenuItem
            id="stern-is-awesome-copier-managed"
            label="Copy Managed"
            action={() => {
              copy(data.role.managed.toString());
            }}
          />
          {data.role.unicodeEmoji && (
            <MenuItem
              id="stern-is-awesome-copier-unicode-emoji"
              label="Copy UnicodeEmoji"
              action={() => { // hi ;3
                copy(data.role.unicodeEmoji);
              }}
            />
          )}
          <MenuItem
            id="stern-is-awesome-copier-pos"
            label="Copy Position"
            action={() => {
              copy(data.role.position.toString());
            }}
          />
        </MenuItem>
        <MenuItem
          id="stern-is-awesome-copier-name"
          label="Copy Name"
          action={() => {
            copy(data.role.name);
          }}
        />
        <MenuItem
          id="stern-is-awesome-copier-perms"
          label="Copy Permissions"
          action={() => {
            copy(data.role.permissions.toString() + "n");
          }}
        />
        <MenuItem
          id="stern-is-awesome-copier-mention"
          label="Copy Mention"
          action={() => {
            copy(`<@&${data.role.id}>`);
          }}
        />
        {data.role.icon && (
          <MenuItem
            id="stern-is-awesome-copier-icon"
            label="Copy Icon"
            action={() => {
              copy(`https://cdn.discordapp.com/role-icons/${data.role.id}/${data.role.icon}.webp?size=1280&quality=lossless`);
            }}
          />
        )}
      </MenuItem>
    );
  });
  
  // don't change your config for this weirdo
  if (config.get('devOnly', false))
  {
    allEnums.forEach(contextType => {
      injector.utils.addMenuItem(contextType, (data) => (
        <MenuItem id={"copier-menu-react-developer"} label="Copier [DEV]">
          {copierObjects(data, "copier-menu-react-developer")}
        </MenuItem>
      ));
    }); 
  }

  injector.utils.addMenuItem(ContextMenuTypes.GuildContext, (data: { guild: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem id={"copier-menu-channel"} label="Copier Guild">
        {copierObjects(data.guild, "copier-menu")}
      </MenuItem>
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.UserContext, (data: { user: any, channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem id={"copier-menu-user"} label="Copier User">
        {copierObjects(data.user, "copier-menu")}
      </MenuItem>
      <MenuItem id={"copier-menu-channel"} label="Copier Channel">
        {copierObjects(data.channel, "copier-menu")}
      </MenuItem>
      <MenuItem id={"copier-menu-fetchProfile"} label="Copier Profile">
        {copierObjects(UserProfileStore.getUserProfile(data.user.id), "copier-menu-fetchProfile")}
      </MenuItem>
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.ChannelContext, (data: { channel: any, guild: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem id={"copier-menu-user"} label="Copier Guild">
        {copierObjects(data.guild, "copier-menu")}
      </MenuItem>
      <MenuItem id={"copier-menu-channel"} label="Copier Channel">
        {copierObjects(data.channel, "copier-menu")}
      </MenuItem>
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.ThreadContext, (data: { channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem id={"copier-menu-channel"} label="Copier Channel">
        {copierObjects(data.channel, "copier-menu")}
      </MenuItem>
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.GdmContext, (data: { channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem id={"copier-menu-channel"} label="Copier Channel">
        {copierObjects(data.channel, "copier-menu")}
      </MenuItem>
    </MenuItem>
  ));

  /*injector.utils.addMenuItem('channel-mention-context' as ContextMenuTypes, (data: { channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {copierObjects(data.channel, "copier-menu")}
    </MenuItem>
  ));*/

  /*injector.utils.addMenuItem('attachment-link-context' as ContextMenuTypes, (data: { attachmentUrl: any, attachmentName: string }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      <MenuItem
        id="stern-is-awesome-copier-attachmentName"
        label="Copy Attachment Name"
        action={() => {
          copy(data.attachmentName);
        }}
      />
      <MenuItem
        id="stern-is-awesome-copier-attachmentUrl"
        label="Copy Attachment URL"
        action={() => {
          copy(data.attachmentUrl);
        }}
      />
    </MenuItem>
  ));*/
}

export function stop(): void {
  injector.uninjectAll();
}
