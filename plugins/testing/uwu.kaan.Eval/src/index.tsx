import { Injector, components } from "replugged";
import { ContextMenuTypes } from "replugged/types";

const inject = new Injector();

const { MenuItem } = components.ContextMenu;

export function start() {
  inject.utils.addMenuItem(ContextMenuTypes.Message, (data) => {
    const regex = /`([^`]+)`/;
    const regex2 = /```([^`]+)```/;
    const match = regex.exec(data.message.content) ?? regex2.exec(data.message.content);
    if (match && match[1]) {
      const command = match[1];
      return (
        <MenuItem id={'eval-better-tharki-uwu'} label={'Execute'} action={() => {
          try {
            const result = eval(command);
            console.log(result)
          } catch (error) {
            console.log(error)
          }
        }} />
      );
    }
  });
}

export function stop() {
  inject.uninjectAll();
}
