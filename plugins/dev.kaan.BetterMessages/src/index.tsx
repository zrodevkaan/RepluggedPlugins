import React, { useState } from "react";
import { common, Injector, settings, util, webpack } from "replugged";
import { Button, SwitchItem, TextArea, TextInput } from "replugged/components";
import { didUserEnableCustomAlertsOwO } from "../../dev.kaan.Reminders/src/sounds/SOwOunds";

const { fluxDispatcher } = common;
const MessageEngine: { sendMessage: () => void } = webpack.getByProps("_sendMessage");
export const owo = await settings.init("dev.kaan.bettermessages");
const injector = new Injector();

interface Message {
  [1]: {};
  content: String;
}

export function start() {
  // fluxDispatcher.subscribe("MESSAGE_CREATE", IDoTheRegexThingies);
  // I no longer do the Regex thingies

  injector.after(MessageEngine, "sendMessage", (data: {}, b, c) => {
    let rows = owo.get("rows");
    let MessageContent = util.findInReactTree(data, (x) => Boolean(x?.content)).content as String;

    if (rows && owo.get("startRegex")) {
      // did the user config let the plugin use the regex ?
      rows.forEach((row) => {
        const findValue = row.findValue; // this finds stuff
        const replaceValue = row.replaceValue; // this is the left text box

        const regex = new RegExp(`[${findValue}${findValue.toUpperCase()}]`, "g");

        MessageContent = MessageContent.replace(regex, (match) => {
          return match === match.toUpperCase() ? replaceValue.toUpperCase() : replaceValue;
          // it works? why
        });
      });
    }

    const Data: Message = data?.[1]; // beginner typescript user
    Data.content = MessageContent;
  });
}

/*function IDoTheRegexThingies(props) {
  console.log(props);
}*/

export function stop(): void {
  injector.uninjectAll();
}

// I will probably use this.
function parseRegexInput(regexInput) {
  const matches = regexInput.match(/^\/(.*)\/([gimuy]*)$/);
  if (matches) {
    return { pattern: matches[1], flag: matches[2] };
  }
  return null;
}

export function Settings() {
  const initialRows = owo.get("rows") || [{ findValue: "", replaceValue: "" }];
  const [rows, setRows] = useState(initialRows);

  const handleInputChange = (index, fieldValue, fieldKey) => {
    const updatedRows = rows.map((row, rowIndex) => {
      if (index === rowIndex) {
        return { ...row, [fieldKey]: fieldValue };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { findValue: "", replaceValue: "" }]);
  };

  const resetSettings = () => {
    const defaultRows = [{ findValue: "", replaceValue: "" }];
    setRows(defaultRows);
    owo.set("rows", defaultRows);
  };

  const saveRow = () => {
    owo.set("rows", rows);
  };

  const deleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    owo.set("rows", updatedRows);
  };

  return (
    <React.Fragment>
      <SwitchItem
        children="Use Regex"
        note="Prevents plugin from replacing your messages with regex."
        {...util.useSetting(owo, "startRegex", false)}
        value={owo.get("startRegex")}
      />
      {rows.map((row, index) => (
        <>
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <TextInput
              value={row.findValue}
              onChange={(e) => handleInputChange(index, e, "findValue")}
              placeholder="Find Regex"
              style={{ width: "140%" }}
            />
            <TextInput
              value={row.replaceValue}
              onChange={(e) => handleInputChange(index, e, "replaceValue")}
              placeholder="Replace"
              style={{ width: "140%" }}
            />
            <Button
              style={{ backgroundColor: "var(--status-danger)" }}
              onClick={() => deleteRow(index)}>
              Delete Row
            </Button>
          </div>
        </>
      ))}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={saveRow} style={{ alignSelf: "center", marginRight: "10px" }}>
          Save Rows
        </Button>
        <Button onClick={resetSettings} style={{ alignSelf: "center", margin: "0 10px" }}>
          Reset Settings
        </Button>
        <Button onClick={addRow} style={{ alignSelf: "center", marginLeft: "10px" }}>
          Add Row
        </Button>
      </div>
    </React.Fragment>

    // tharki is so silly :3
  );
}
