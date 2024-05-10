import {common, Injector, util, webpack} from "replugged";
import {ContextMenuTypes} from "replugged/types";

const injector: Injector = new Injector();
const { users: m } = common;
const v = webpack.getByProps("setBadge");
const d = webpack.getBySource("getCodecCapabilities");
const f = webpack.getByProps("setInputVolume");
const UserModule: any = webpack.getByProps("getCurrentUser")

export function start(): void {
  injector.after(d.prototype,"connect",(a,b,c)=>
  {
    b.setCanHavePriority(UserModule.getCurrentUser().id, true)
    injector.before(b.conn, "setTransportOptions", (e) => {
      e[0].attenuation = true;
      e[0].attenuateWhileSpeakingSelf = false;
      e[0].attenuateWhileSpeakingOthers = true;
      e[0].attenuationFactor = 75;
      e[0].automaticGainControl = false;
      e[0].setLocalVolume = 300;
      e[0].prioritySpeakerDucking = 75;
      if (e[0].audioEncoder) {
        e[0].audioEncoder.channels = parseFloat(9.0);
        e[0].audioEncoder.freq = 195800;
        e[0].audioEncoder.compressionLevel = -100000000000;
        e[0].audioEncoder.rate = 683e3;
      }
      if (e[0].fec) {
        e[0].fec = false;
      }
      if (e[0].encodingVoiceBitRate) {
        e[0].encodingVoiceBitRate = 1512e3;
      }
      f.setInputVolume(300000000);
    })
  })
}

export function stop(){
  injector.uninjectAll();
}
