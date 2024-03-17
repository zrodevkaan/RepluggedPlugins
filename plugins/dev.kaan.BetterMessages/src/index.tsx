import React, { useState } from "react";
import { common, Injector, settings, util, webpack } from "replugged";
import { Button, SwitchItem, TextArea, TextInput } from "replugged/components";

const { fluxDispatcher } = common;
const MessageEngine: { sendMessage: () => void } = webpack.getByProps("_sendMessage");
const TextChatButtons = webpack.getBySource("ChannelTextAreaButtons");
export const owo = await settings.init("dev.kaan.bettermessages");
const injector = new Injector();

interface Message {
  [1]: {};
  content: String;
}

export function start() {
  // fluxDispatcher.subscribe("MESSAGE_CREATE", IDoTheRegexThingies);
  // I no longer do the Regex thingies

  /*injector.after(TextChatButtons, "type", (a, b, c) => {
    const Buttons = util.findInReactTree(b, (x) => Boolean(x?.length));

    if (Buttons && Array.isArray(Buttons)) {
      const newButton = (
        <button className="better-messages-enabled-regex-OWOWOWOWOOW">
          <svg width="25" height="25" viewBox="0 0 576 512">
            <path
              fill="currentColor"
              d="M17.9,12v4.2c6.5-0.9,7.7,0,7.7,6.7v36.6h47.2V65H8.7V12H17.9L17.9,12z M63.6,46c0,13.4-10.5,23.5-23.5,23.5 S16.5,59.4,16.5,46S27.1,22.5,40.1,22.5S63.6,32.6,63.6,46L63.6,46z"></path>
            <rect x="10" y="10" width="600pt" height="70px" fill="#f04747"/>
          </svg>
        </button>
      );

      Buttons.unshift(newButton);
    }
  });*/

  injector.after(MessageEngine, "sendMessage", (data: {}, b, c) => {
    let rows = owo.get("rows");
    let MessageContent = util.findInReactTree(data, (x) => Boolean(x?.content)).content as String;

    const Data: Message = data?.[1];

    if (rows && owo.get("startRegex")) {
      rows.forEach((row) => {
        const findValue = row.findValue;
        const replaceValue = row.replaceValue;
        const regex = new RegExp(`${findValue}`, "gi");
        // regex is so silly.
        MessageContent = MessageContent.split(" ")
          .map((word) =>
            word.startsWith("http")
              ? word
              : word.replace(regex, (match) =>
                match === match.toLocaleUpperCase()
                  ? replaceValue.toLocaleUpperCase()
                  : replaceValue,
              ),
          )
          .join(" ");
      });
    }

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
  console.log("rows", rows)
  const handleInputChange = (index, fieldValue, fieldKey) => {
    const updatedRows = rows.map((row, rowIndex) => {
      if (index === rowIndex) {
        return { ...row, [fieldKey]: fieldValue };
      }
      return row;
    });

    setRows(updatedRows);
    saveRow();
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
