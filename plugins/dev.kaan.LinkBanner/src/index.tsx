/* eslint-disable no-extend-native */
import { Injector, util, webpack } from "replugged";

const injector: Injector = new Injector();
const ProfilePopout: any = webpack.getBySource(".GifAutoPlay.getSetting()", { raw: true })?.exports;

export function start() {
  injector.after(ProfilePopout, 'default', (a, b, c) => {
    const OwOFindLinkBecauseColinAsked: any = util.findInReactTree(b, (x) => Boolean(x?.className));

    if(OwOFindLinkBecauseColinAsked?.style?.backgroundImage) {
      const backgroundImage = OwOFindLinkBecauseColinAsked.style.backgroundImage;
      const FindSize = /(\?size=\d+)?$/;
      const URL = backgroundImage.slice(4, -2).replace(FindSize, '?size=4096');

      if (URL) {
        OwOFindLinkBecauseColinAsked.onClick = () => { open(URL); }
      }
    }
  });
}
