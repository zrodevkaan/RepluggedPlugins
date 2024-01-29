import { common, Injector, util, webpack } from "replugged";

const { flux: Flux, fluxDispatcher: FluxDispatcher } = common;

class OwOStore extends Flux.Store {
  public static displayName = "OwOStore";

  public owoMessage(message: string): string {
    return message + " OwO";
  }

  public owoifyBasic(message: string): string {
    // Basic owoification
    return message
      .replace(/[lr]/g, "w")
      .replace(/[LR]/g, "W")
      .replace(/th/g, "f")
      .replace(/Th/g, "F");
  }

  public owoifyEmotion(message: string): string {
    return this.owoMessage(message) + " UwU";
  }

  public owoifyRandom(message: string): string {
    const randomTransformations = {
      love: "wuv",
      you: "yu",
      hello: "hewwo",
    };

    return message.replace(/\b(\w+)\b/g, (match) => randomTransformations[match] || match);
  }

  public __getLocalVars(): Record<string, unknown> {
    return { this: this };
  }
}

export function start() {
  if (!webpack.getByStoreName("OwOStore")) new OwOStore(common.fluxDispatcher, {});
}

export function stop(): void {}
