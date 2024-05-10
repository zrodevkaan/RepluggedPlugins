import {Injector, common, util, webpack} from "replugged";

const injector: Injector = new Injector();
const {Item} = webpack.getByProps('TabBar').TabBar;
const ProfileTabs = await webpack.waitForModule(webpack.filters.bySource(".UserProfileSections.ACTIVITY:"))
export function start(): void {
  console.log("Starting...");
  injector.after(
    ProfileTabs,
    'default',
    (a: any) => {
      if (a[0].selectedSection === "MUTUAL_GROUPS") {
        return "MUTUAL_GROUPS";
      }
    }
  );

}

export function stop(){
  injector.uninjectAll();
}

export default function MutualGroupsItem()
{
  return (<Item key={'.666'} id={'MUTUAL_GROUPS'} onItemSelect={() => {return "MUTUAL_GROUPS"}}/>)
}
