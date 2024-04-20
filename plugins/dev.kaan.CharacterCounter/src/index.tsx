import { Injector, settings, util, webpack } from "replugged";
import { React } from "replugged/common";
import { AnyFunction } from "replugged/types";
import { Tree } from "replugged/util";

export interface SettingsType {
  roleColor?: boolean;
}

const owo = await settings.init<SettingsType>("dev.kaan.charactercounter");
const TextAreauwu: { type: { render: AnyFunction } } = webpack.getBySource('chat input type must be set')
const inject = new Injector();
const { canUseIncreasedMessageLength }: any = webpack.getByProps("canUseIncreasedMessageLength")

interface ChildrenStuff { props:{children: Array<React.ReactElement>} }

export function start() {
  inject.after(TextAreauwu.type, "render", (args, res) => {
    const children = util.findInReactTree(res as unknown as Tree, (x: {props:{children: {}, className: string}}) => Boolean(x?.props?.className?.includes("channelTextArea") && Array.isArray(x?.props?.children))) as unknown as ChildrenStuff;
    if (children?.props.children) {
      // console.log(children)
      const props = children.props;
      const characterLength = args[0]?.textValue?.length || 0;
      const characterAmount = canUseIncreasedMessageLength() ? 4000 : 2000
      const displayText = `${characterLength}/${characterAmount}`;
      const textColor = characterLength > characterAmount ? '#F85B60' : 'gray';
      // during the testing of this plugin. my little oneko kitty kept walking over my
      // div with my characterAmount. how dare it walk over it >:(
      props.children.push(
                  // What's the meaning of life? 
        <div style={{ zIndex: '42', color: textColor, fontWeight: 'bold', fontSize: '13.5px', position: 'absolute', right: '0', textAlign: 'center' }}>
          {displayText}
        </div>
      );
    }
  })
}

export function Settings() {

}

export function stop() {
  inject.uninjectAll();
}
