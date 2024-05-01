import { components, Injector, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { hexToHSL, hexToRGB } from "./helpers";

const {
  ContextMenu: { MenuItem },
} = components;

const injector = new Injector();
const GuildStore = webpack.getByStoreName("GuildStore");
const CurrentGuild = webpack.getByStoreName("SelectedGuildStore");

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

export function start() {
  injector.utils.addMenuItem(ContextMenuTypes.DevContext, (data: { id: string, role: any }) => {
    data.role = GuildStore.getRole(CurrentGuild.getGuildId(), data?.id);
    console.log(data.role);
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

  injector.utils.addMenuItem(ContextMenuTypes.GuildContext, (data: { guild: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {Object.keys(data.guild || {}).map((key) => (
        Array.isArray(data.guild?.[key]) ? (
          <MenuItem disabled={!data.guild?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {(data.guild?.[key] || []).map((item, subIndex) => (
              <MenuItem key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`Copy ${item?.name || 'Unnamed Item'}`} disabled={item === null}>
                {Object.keys(item || {}).map((itemKey, itemIndex) => (
                  <MenuItem disabled={item?.[itemKey] === undefined || item?.[itemKey] === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${toPascalCase(itemKey).replace("_", " ")}: ${item?.[itemKey]}`} action={() => {
                    copy(item?.[itemKey]?.toString() || '');
                  }} />
                ))}
              </MenuItem>
            ))}
          </MenuItem>
        ) : typeof data.guild?.[key] === 'object' ? (
          <MenuItem disabled={!data.guild?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {Object.entries(data.guild?.[key] || {}).map(([objKey, objValue], subIndex) => (
              Array.isArray(objValue) ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {objValue.map((item, itemIndex) => (
                    <MenuItem disabled={item === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${item}`} action={() => {
                      copy(item?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : typeof objValue === 'object' ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {Object.entries(objValue || {}).map(([innerObjKey, innerObjValue], innerIndex) => (
                    <MenuItem disabled={innerObjValue === null} key={`copier-copy-${key}-${subIndex}-${innerIndex}`} id={`copier-copy-${key}-${subIndex}-${innerIndex}`} label={`${toPascalCase(innerObjKey).replace("_", " ")}: ${innerObjValue}`} action={() => {
                      copy(innerObjValue?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}: ${objValue}`} action={() => {
                  copy(objValue?.toString() || '');
                }} />
              )
            ))}
          </MenuItem>
        ) : (
          <MenuItem disabled={data.guild?.[key] === undefined || data.guild?.[key] === null} key={`copier-copy-${key}`} id={`copier-copy-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`} action={() => {
            copy(data.guild?.[key]?.toString() || '');
          }} />
        )
      ))}
    </MenuItem>
  ));
  
  injector.utils.addMenuItem(ContextMenuTypes.UserContext, (data: { user: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {Object.keys(data.user || {}).map((key) => (
        Array.isArray(data.user?.[key]) ? (
          <MenuItem disabled={!data.user?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {(data.user?.[key] || []).map((item, subIndex) => (
              <MenuItem key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`Copy ${item?.name || 'Unnamed Item'}`} disabled={item === null}>
                {Object.keys(item || {}).map((itemKey, itemIndex) => (
                  <MenuItem disabled={item?.[itemKey] === undefined || item?.[itemKey] === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${toPascalCase(itemKey).replace("_", " ")}: ${item?.[itemKey]}`} action={() => {
                    copy(item?.[itemKey]?.toString() || '');
                  }} />
                ))}
              </MenuItem>
            ))}
          </MenuItem>
        ) : typeof data.user?.[key] === 'object' ? (
          <MenuItem disabled={!data.user?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {Object.entries(data.user?.[key] || {}).map(([objKey, objValue], subIndex) => (
              Array.isArray(objValue) ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {objValue.map((item, itemIndex) => (
                    <MenuItem disabled={item === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${item}`} action={() => {
                      copy(item?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : typeof objValue === 'object' ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {Object.entries(objValue || {}).map(([innerObjKey, innerObjValue], innerIndex) => (
                    <MenuItem disabled={innerObjValue === null} key={`copier-copy-${key}-${subIndex}-${innerIndex}`} id={`copier-copy-${key}-${subIndex}-${innerIndex}`} label={`${toPascalCase(innerObjKey).replace("_", " ")}: ${innerObjValue}`} action={() => {
                      copy(innerObjValue?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}: ${objValue}`} action={() => {
                  copy(objValue?.toString() || '');
                }} />
              )
            ))}
          </MenuItem>
        ) : (
          <MenuItem disabled={data.user?.[key] === undefined || data.user?.[key] === null} key={`copier-copy-${key}`} id={`copier-copy-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`} action={() => {
            copy(data.user?.[key]?.toString() || '');
          }} />
        )
      ))}
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.ChannelContext, (data: { channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {Object.keys(data.channel || {}).map((key) => (
        Array.isArray(data.channel?.[key]) ? (
          <MenuItem disabled={!data.channel?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {(data.channel?.[key] || []).map((item, subIndex) => (
              <MenuItem key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`Copy ${item?.name || 'Unnamed Item'}`} disabled={item === null}>
                {Object.keys(item || {}).map((itemKey, itemIndex) => (
                  <MenuItem disabled={item?.[itemKey] === undefined || item?.[itemKey] === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${toPascalCase(itemKey).replace("_", " ")}: ${item?.[itemKey]}`} action={() => {
                    copy(item?.[itemKey]?.toString() || '');
                  }} />
                ))}
              </MenuItem>
            ))}
          </MenuItem>
        ) : typeof data.channel?.[key] === 'object' ? (
          <MenuItem disabled={!data.channel?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {Object.entries(data.channel?.[key] || {}).map(([objKey, objValue], subIndex) => (
              Array.isArray(objValue) ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {objValue.map((item, itemIndex) => (
                    <MenuItem disabled={item === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${item}`} action={() => {
                      copy(item?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : typeof objValue === 'object' ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {Object.entries(objValue || {}).map(([innerObjKey, innerObjValue], innerIndex) => (
                    <MenuItem disabled={innerObjValue === null} key={`copier-copy-${key}-${subIndex}-${innerIndex}`} id={`copier-copy-${key}-${subIndex}-${innerIndex}`} label={`${toPascalCase(innerObjKey).replace("_", " ")}: ${innerObjValue}`} action={() => {
                      copy(innerObjValue?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}: ${objValue}`} action={() => {
                  copy(objValue?.toString() || '');
                }} />
              )
            ))}
          </MenuItem>
        ) : (
          <MenuItem disabled={data.channel?.[key] === undefined || data.channel?.[key] === null} key={`copier-copy-${key}`} id={`copier-copy-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`} action={() => {
            copy(data.channel?.[key]?.toString() || '');
          }} />
        )
      ))}
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.ThreadContext, (data: { channel: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {Object.keys(data.channel).map(key => (
        <MenuItem disabled={data.channel[key] === undefined || data.channel[key] === null} key={`copier-copy-${key}`} id={`copier-copy-${key}`} label={`Copy ${toPascalCase(key)}`} action={() => {
          copy(data.channel[key].toString() || '')
        }}/>
      ))}
    </MenuItem>
  ));

  injector.utils.addMenuItem(ContextMenuTypes.Message, (data: { message: any }) => (
    <MenuItem id={"copier-menu"} label="Copier">
      {Object.keys(data.message || {}).map((key) => (
        Array.isArray(data.message?.[key]) ? (
          <MenuItem disabled={!data.message?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {(data.message?.[key] || []).map((item, subIndex) => (
              <MenuItem key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`Copy ${item?.name || 'Unnamed Item'}`} disabled={item === null}>
                {Object.keys(item || {}).map((itemKey, itemIndex) => (
                  <MenuItem disabled={item?.[itemKey] === undefined || item?.[itemKey] === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${toPascalCase(itemKey).replace("_", " ")}: ${item?.[itemKey]}`} action={() => {
                    copy(item?.[itemKey]?.toString() || '');
                  }} />
                ))}
              </MenuItem>
            ))}
          </MenuItem>
        ) : typeof data.message?.[key] === 'object' ? (
          <MenuItem disabled={!data.message?.[key]} key={`copier-submenu-${key}`} id={`copier-submenu-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`}>
            {Object.entries(data.message?.[key] || {}).map(([objKey, objValue], subIndex) => (
              Array.isArray(objValue) ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {objValue.map((item, itemIndex) => (
                    <MenuItem disabled={item === null} key={`copier-copy-${key}-${subIndex}-${itemIndex}`} id={`copier-copy-${key}-${subIndex}-${itemIndex}`} label={`${item}`} action={() => {
                      copy(item?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : typeof objValue === 'object' ? (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}`}>
                  {Object.entries(objValue || {}).map(([innerObjKey, innerObjValue], innerIndex) => (
                    <MenuItem disabled={innerObjValue === null} key={`copier-copy-${key}-${subIndex}-${innerIndex}`} id={`copier-copy-${key}-${subIndex}-${innerIndex}`} label={`${toPascalCase(innerObjKey).replace("_", " ")}: ${innerObjValue}`} action={() => {
                      copy(innerObjValue?.toString() || '');
                    }} />
                  ))}
                </MenuItem>
              ) : (
                <MenuItem disabled={objValue === null} key={`copier-submenu-item-${key}-${subIndex}`} id={`copier-submenu-item-${key}-${subIndex}`} label={`${toPascalCase(objKey).replace("_", " ")}: ${objValue}`} action={() => {
                  copy(objValue?.toString() || '');
                }} />
              )
            ))}
          </MenuItem>
        ) : (
          <MenuItem disabled={data.message?.[key] === undefined || data.message?.[key] === null} key={`copier-copy-${key}`} id={`copier-copy-${key}`} label={`Copy ${toPascalCase(key).replace("_", " ")}`} action={() => {
            copy(data.message?.[key]?.toString() || '');
          }} />
        )
      ))}
    </MenuItem>
  ));
  
  injector.utils.addMenuItem('attachment-link-context' as ContextMenuTypes, (data: { attachmentUrl: any, attachmentName: string }) => (
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
  ));
}


export function stop(): void {
  injector.uninjectAll();
}
