/* eslint-disable no-extend-native */
import { components, Injector, settings, util, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { modal, React } from "replugged/common";
import "./styles.css";
import { Clickable } from "replugged/components";
import Menu from "replugged/dist/renderer/modules/components/ContextMenu"; // thanks for the css my beloved :3

const {
  ContextMenu: { MenuItem },
  Tooltip,
  SwitchItem,
} = components;
const owo = await settings.init("dev.kaan.timezones");
const colorBrands: any = webpack.getByProps("colorBrand");
const ModalList: any = webpack.getByProps("ConfirmModal");
const classes: any = webpack.getByProps("iconItem");
const injector: Injector = new Injector();
const ProfilePopout: any = webpack.getBySource(".GifAutoPlay.getSetting()", { raw: true })?.exports;
const UsernameDecoration = webpack.getByProps<{ default: any; UsernameDecorationTypes: {} }>(
  "UsernameDecorationTypes",
);
interface Data {
  user: object;
}

const DarkOverlay: any = ({ children }) => <div className={"timezone-overlay"}>{children}</div>;

async function openTimezoneModal(user: any) {

  const RenderThis = (props) => {
    const [timezone, setTimezone] = React.useState(owo.get(user.id, {})?.timezone);
    const [filteredTimezones, setFilteredTimezones] = React.useState(getAllTimezones());

    const handleSearch = (searchValue) => {
      const filtered = getAllTimezones().filter((tz) =>
        tz.label.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredTimezones(filtered);
    };

    return (
      <ModalList.ConfirmModal
        {...props}
        header={`${user.username}'s Timezone`}
        confirmButtonColor={colorBrands.colorBrand}
        confirmText="Okay">
        <ModalList.SearchableSelect
          onSearchChange={handleSearch}
          options={filteredTimezones}
          value={timezone}
          clearable={true}
          onChange={(value) => {
            setTimezone(value);
            owo.set(user.id, { timezone: value });
          }}
        />
      </ModalList.ConfirmModal>
    );
  };
  modal.openModal((props) => <RenderThis {...props} />);
}

export function start() {
  injector.after(ProfilePopout, "default", (a, b, c) => {
    const Children: any = util.findInReactTree(b, (x) => Boolean(x?.className)).children;
    const User = a?.[0]["user"];

    const selectedTimezone = owo.get(User.id, { timezone: "" })?.timezone || "";

    const currentTime = selectedTimezone ? getCurrentTimeInTimezone(selectedTimezone) : "Set Timezone";

    Children.unshift(

      owo.get("icon", true) ? (

        <Tooltip
          text={currentTime}
          className={`${classes.iconItem} timezones-icon`}
          style={{
            position: "absolute",
            right: "12px",
            bottom: "10px",
          }}>
          <Clickable onClick={() => openTimezoneModal(User)}>
            <svg
              className={classes.actionIcon}
              viewBox="0 0 24 24"
              style={{
                width: "18px",
                height: "18px",
              }}>
              <path
                fill="currentColor"
                d="M11.997 18.532a1 1 0 0 1 .993.883l.007.117v1.456a1 1 0 0 1-1.993.116l-.007-.116v-1.456a1 1 0 0 1 1-1Zm6.036-1.932 1.03 1.03a1 1 0 0 1-1.415 1.413l-1.029-1.029a1 1 0 0 1 1.414-1.414Zm-10.66 0a1 1 0 0 1 0 1.414l-1.028 1.03a1 1 0 0 1-1.415-1.415l1.03-1.03a1 1 0 0 1 1.414 0ZM12.01 6.472a5.525 5.525 0 1 1 0 11.05 5.525 5.525 0 0 1 0-11.05ZM11.25 9a.75.75 0 0 0-.743.648l-.007.102v3.004l.007.102a.75.75 0 0 0 .642.641l.101.007h2l.102-.007a.75.75 0 0 0 .641-.641l.007-.102-.007-.102a.75.75 0 0 0-.641-.641l-.102-.007H12V9.75l-.006-.102A.75.75 0 0 0 11.25 9Zm9.727 2.018a1 1 0 0 1 .117 1.993l-.117.007h-1.455a1 1 0 0 1-.117-1.993l.117-.007h1.456ZM4.48 10.99a1 1 0 0 1 .117 1.993l-.117.007H3.023a1 1 0 0 1-.116-1.993l.116-.007H4.48ZM6.25 4.874l.095.083 1.029 1.03a1 1 0 0 1-1.32 1.497L5.96 7.4 4.93 6.371a1 1 0 0 1 1.32-1.497Zm12.813.083a1 1 0 0 1 .083 1.32l-.083.094-1.03 1.03a1 1 0 0 1-1.497-1.32l.083-.095 1.03-1.03a1 1 0 0 1 1.414 0ZM12 2.013a1 1 0 0 1 .993.883l.007.117v1.455a1 1 0 0 1-1.994.117l-.006-.117V3.013a1 1 0 0 1 1-1Z"
              />
            </svg>
          </Clickable>
        </Tooltip>
      ) : (
        <DarkOverlay>
          <Clickable onClick={() => openTimezoneModal(User)}>
            <ModalList.Text style={{ fontSize: "inherit", color: "#fff" }}>
              {currentTime}
            </ModalList.Text>
          </Clickable>
        </DarkOverlay>
      )
    );

  });



  injector.utils.addMenuItem("user-context" as ContextMenuTypes, (a, b) => {
    const uwu = owo.get((a?.user as any).id, { timezone: "" });
    return (<>
      <MenuItem
        id={`${uwu?.timezone ? "change" : "set"}-timezone`}
        label={`${uwu?.timezone ? "Change" : "Set"} Timezone`}
        action={() => openTimezoneModal(a?.user)}
      />
    </>
    );
  });
}

const getAllTimezones = () =>
  Intl.supportedValuesOf("timeZone").map((timezone) => {
    const time = getCurrentTimeInTimezone(timezone);
    return {
      label: `${timezone} ${time} (${new Intl.DateTimeFormat(undefined, { timeZone: timezone, timeZoneName: "short" })
        .formatToParts(new Date())
        .find((part) => part.type == "timeZoneName").value
        })`,
      value: timezone,
    };
  });
function getCurrentTimeInTimezone(timezone: string): string {
  return new Date().toLocaleString("en-US", {
    timeZone: timezone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
}

export function stop() {
  injector.uninjectAll();
}

export function Settings() {
  return (
    <>
      <SwitchItem
        note="Use Icon with tooltip instead of text"
        {...util.useSetting(owo, "icon", true)}>
        Show Icon
      </SwitchItem>
    </>
  );
}
