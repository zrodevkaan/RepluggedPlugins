import {Injector, common, settings, webpack, util} from "replugged";
import {SwitchItem} from "replugged/components";
const { fluxDispatcher } = common;
export const owo = await settings.init("dev.kaan.gamermode");
const injector = new Injector();
const Modals: { TextInput: any } = webpack.getByProps("TextInput");
const { TextInput } = Modals
const RunningGameStore = webpack.getByStoreName("RunningGameStore");

const UserSettings: { PreloadedUserSettingsActionCreators: { updateAsync: (type: string, callback: Function, someIntValue?: 0) => void} } = webpack.getByProps("PreloadedUserSettingsActionCreators");

export interface GameDetection
{
  games: [ {name: string} ];
  runningGames: [ {name: string} ];
  removed: [ {name: string} ];
  added: [ {name: string} ];
}
export function start() {
  fluxDispatcher.subscribe("RUNNING_GAMES_CHANGE", GameDetect)
}
function GetGamesToList(something: string)
{
  const GameListToString = something.split(",")
  owo.set("SelectedGames",GameListToString)
  return GameListToString;
}

function GetValue(settingName)
{
  return owo.get(settingName);
}

export function GameDetect(a: any) {
  
  if (GetValue("dndOnGaming"))
  {
    UserSettings.PreloadedUserSettingsActionCreators.updateAsync(
      "status",
      (statusSetting: { status: { value: string; }; }) => {
        statusSetting.status.value = a.removed[0] ? "online" : "dnd";
      },
      0
    );
  }
  
  // this will come later. idk a good way to do this.
  /*const Games: GameDetection = a;
  const AddedGame = a.games[0] ? a.games[0].name.toLowerCase() : a.runningGames[0].name.toLowerCase()

  const SavedGames = owo.get('SelectedGames',[]).map((game: string) => game.toLowerCase());

  if (SavedGames.includes(AddedGame)) {
    console.log("bro you started playing a game named", AddedGame);
  }*/
}
export function stop(): void {
  fluxDispatcher.unsubscribe("RUNNING_GAMES_CHANGE", GameDetect)
}
export function Settings() {
  /*const [textInput, setTextInput] = useState('');

  const mappedGames = RunningGameStore.getGamesSeen().map(game => ({
    label: game.name,
    value: game.id
  }));*/

  /*<TextInput
    placeholder={"Enter games separated by commas, Example: lethal, outpath"}
    onChange={e => {
      setTextInput(e);
      GetGamesToList(e);
    }}
    value={owo.get("SelectedGames").toString()}
  />*/
  //hmm
  return (
    <div>
      <SwitchItem {...util.useSetting(owo, "dndOnGaming")} note={"When a game starts. Your status will automatically change. ex... (online -> dnd)"}>
        GamerStatus
      </SwitchItem>
      <SwitchItem {...util.useSetting(owo, "autoPurgeMemory")} note={"When a game starts. Discords memory will be cleared every 5 seconds."}>
        Purger
      </SwitchItem>
    </div>
  )
}
