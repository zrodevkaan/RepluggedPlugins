import {common, Injector, util, webpack, settings} from "replugged";

const injector = new Injector();
// please dont use this yet. it crashing from emoji auto complete.

const owo = await settings.init('dev.kaan.QuickMessages');

interface QuickMessagesState {
  quickMessages: string[];
}
const { toRichValue } = webpack.getByProps("toRichValue");
function CapitalizeOwO(inputString) {
  return inputString.replace(/(?:^|\.\s+|:)([a-z])/g, (match) => match.toUpperCase());
}
export function start() {
  injector.before(
    webpack.getBySource("isSubmitButtonEnabled:", { all: true })[0].type,
    "render",
    (args, res) => {
      args[0].richValue = toRichValue(CapitalizeOwO(args[0].textValue));
      return res;
    }
  );
}

export function stop(): void {
  injector.uninjectAll();
}
