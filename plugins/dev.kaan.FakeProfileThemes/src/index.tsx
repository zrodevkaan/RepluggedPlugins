import { Injector, common, settings, webpack, util } from "replugged";
import React from "react";
import { Store } from "replugged/dist/renderer/modules/common/flux";
import { Button } from "replugged/components";
const { fluxDispatcher } = common;

const injector = new Injector();
const UserProfileStore: any = webpack.getByStoreName("UserProfileStore")
const COLOR_REGEX = /\[(#[0-9a-fA-F]{6})\s*,\s*(#[0-9a-fA-F]{6})]/;
const GLOBAL_REGEX = new RegExp(COLOR_REGEX, "g");

export function decode(text: string): string {
  return text.replace(/[\u{E0000}-\u{E007F}]/ug, (match) => String.fromCodePoint(match.codePointAt(0)! - 0xE0000));
}


export function encode(primary: number, accent: number): string {
  const primaryHex = primary.toString(16).padStart(6, "0");
  const accentHex = accent.toString(16).padStart(6, "0");

  let encoded = "";
  for (const char of `[#${primaryHex},#${accentHex}]`) {
    const code = char.codePointAt(0)!;
    if (code >= 0x20 && code <= 0x7f) {
      encoded += String.fromCodePoint(code + 0xe0000);
    }
  }

  return " " + encoded;
}

export function start() {
  injector.after(UserProfileStore, "getUserProfile", (a, b, c) => {
    const decoded = decode(b?.bio ?? "");
    // ?? stopped the crashing. idky
    const colors = decoded.match(COLOR_REGEX);

    if (!colors) return;

    colors.shift();

    b.themeColors = colors.map((c) => parseInt("0x" + c.slice(1)));
    b.premiumType = 2;
    b.bio = decoded.replaceAll(GLOBAL_REGEX, "");
  })
}

export function copyButton({ primary, accent }) {
  return <Button onClick={() => { DiscordNative.clipboard.copy(encode(primary, accent)) }}> Copy 3y3 </Button>
}

export function stop(): void {
  injector.uninjectAll();
}
