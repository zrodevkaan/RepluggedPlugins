/* eslint-disable no-extend-native */
import { components, Injector, settings, util, webpack } from "replugged";
import { ContextMenuTypes } from "replugged/types";
import { modal, React } from "replugged/common";
import "./styles.css"; // thanks for the css my beloved :3

const {
  ContextMenu: { MenuItem },
} = components;
const owo = await settings.init("dev.kaan.timezones");
const colorBrands: any = webpack.getByProps("colorBrand");
const ModalList: any = webpack.getByProps("ConfirmModal");
const injector: Injector = new Injector();
const ProfilePopout: any = webpack.getBySource(".GifAutoPlay.getSetting()", { raw: true })?.exports;
const DarkOverlay: any = ({ children }) => (
  <div
    style={{
      position: "absolute",
      bottom: "10px",
      right: "10px",
      backgroundColor: "rgba(31, 31, 31, 0.8)",
      padding: "10px",
      borderRadius: "5px",
      width: "100px",
      height: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
    {children}
  </div>
);

async function openTimezoneModal(user: any) {
  const userSettings = (await owo.get(user.id)) || {};
  let selectedTimezone = userSettings.timezone || "";

  const RenderThis = (props) => {
    const [timezone, setTimezone] = React.useState("");
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
        header={`Set ${user.username}'s Timezone`}
        confirmButtonColor={colorBrands.colorBrand}
        confirmText="Set"
        cancelText="Cancel"
        onConfirm={(OWOWOWOOWWO) => {
          userSettings.timezone = timezone;
          owo.set(user.id, userSettings);
        }}>
        <input
          className={"timezone-search"}
          type="text"
          placeholder="Search timezone..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "8px",
            fontSize: "14px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <ModalList.SingleSelect
          options={filteredTimezones}
          value={timezone}
          onChange={(value) => {
            setTimezone(value);
            console.log(value);
          }}
        />
      </ModalList.ConfirmModal>
    );
  };
  modal.openModal((props) => <RenderThis {...props} />);
}

function clearUserTimezone(user: any) {
  const userSettings = owo.get(user.id) || {};
  userSettings.timezone = "";
}

export function start() {
  injector.after(ProfilePopout, "default", (a: any, b, c) => {
    const Children: any = util.findInReactTree(b as {}, (x) => Boolean(x?.className)).children;
    const User = a?.[0].user;

    const userSettings = owo.get(User.id) || {};
    let selectedTimezone = userSettings.timezone || "";

    if (!selectedTimezone) return;

    const currentTime = getCurrentTimeInTimezone(selectedTimezone);

    Children.push(
      <DarkOverlay>
        <ModalList.Text style={{ fontSize: "inherit", color: "#fff" }}>
          {currentTime}
        </ModalList.Text>
      </DarkOverlay>,
    );
  });

  injector.utils.addMenuItem("user-context" as ContextMenuTypes, (a, b) => {
    return (
      <>
        <ModalList.MenuSeparator />
        <MenuItem
          id="set-timezone"
          label="Set Timezone"
          action={() => openTimezoneModal(a?.user)}
        />
        <MenuItem
          id="clear-timezone"
          label="Clear Timezone"
          action={() => clearUserTimezone(a?.user)}
        />
        <ModalList.MenuSeparator />
      </>
    );
  });
}

const getAllTimezones = () =>
  Intl.supportedValuesOf("timeZone").map((timezone) => ({
    label: `${timezone} (${
      new Intl.DateTimeFormat(undefined, { timeZone: timezone, timeZoneName: "short" })
        .formatToParts(new Date())
        .find((part) => part.type == "timeZoneName").value
    })`,
    value: timezone,
  }));

function getCurrentTimeInTimezone(timezone: string): string {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
}

export function stop() {
  injector.uninjectAll();
}
