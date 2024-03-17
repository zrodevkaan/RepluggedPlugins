import {Injector, settings, util, webpack} from "replugged";
import {Button} from "replugged/components";
import './styles.css';
import {useState} from "react";
const injector = new Injector();
const owo = await settings.init("dev.kaan.recovery")
// thank you tharki-poo ;3
const ErrorScreen: any = await webpack.waitForModule(webpack.filters.bySource(/default\.track\((.*?)\.AnalyticEvents\.APP_CRASHED/))
const { sizeLarge }: any = webpack.getByProps("sizeLarge");
const { parse }: any = webpack.getByProps(["defaultRules", "parse"]);
const { FormSwitch }: any = webpack.getByProps("FormSwitch")

export function start() {
  injector.after(ErrorScreen.prototype, "render", (a: any, b, c: {state: {error: {message: String,stack: String}}, setState: ({}) => void}) => {
    const children = b?.props?.action?.props?.children;
    if (!children) return;
    if (!c.state.error) return;
    children?.push(
      [
        <Button
          className={"recovery-button " + sizeLarge}
          onClick={() => {
            c.setState({info: null, error: null});
          }}
        >
          Recover Discord
        </Button>,
        <div
          className={"recovery-parse"} // this breaks BetterCodeBlocks.. sorry
        >
          {parse(`\`\`\`${c.state?.error.stack}\`\`\``)}
        </div>
      ]
    );
  });
}

export function stop(): void {
  injector.uninjectAll();
}

export function Settings() {

  return (
    <FormSwitch
      note={"Allows Discord to be automatically recovered on any React crash. (Possibly) uwu"}
      {...util.useSetting(owo, "automaticRecover", false)}
    >
      Automatic Recover
    </FormSwitch>
  );
}
