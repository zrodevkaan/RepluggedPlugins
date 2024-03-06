import {common, Injector, util, webpack, settings} from "replugged";

const injector = new Injector();
// please dont use this yet. it crashing from emoji auto complete.

const owo = await settings.init('dev.kaan.QuickMessages');

interface QuickMessagesState {
  quickMessages: string[];
}

interface Type
{
  GET: 1,
  SET: 2
}

enum Types
{
  GET = 1,
  SET = 2
}

function returnData(type: Type, key: string, fallback: Boolean = false)
{
  return type == Types.GET ? owo.get(key,fallback) : owo.set
}

export function start() {

}

export function stop(): void {
  injector.uninjectAll();
}
