import { types as DefaultTypes } from "replugged";
import { React } from "replugged/common";
declare global {
  interface Window {
    HomeButtonContextMenuApi: HomeButtonContextMenuApi;
  }
}
export interface HomeButtonContextMenuApi {
  items?: Map<string, React.ReactElement>;
  constructor?: DefaultTypes.AnyFunction;
  addItem?: DefaultTypes.AnyFunction;
  removeItem?: DefaultTypes.AnyFunction;
  forceUpdate?: DefaultTypes.AnyFunction;
  openContextMenu?: DefaultTypes.AnyFunction;
}
export interface GenericModule {
  [key: string]: DefaultTypes.AnyFunction;
}
export interface DiscordNative {
  accessibility: {
    isAccessibilitySupportEnabled: DefaultTypes.AnyFunction;
  };
  app: {
    dock: {
      setBadge: DefaultTypes.AnyFunction;
      bounce: DefaultTypes.AnyFunction;
      cancelBounce: DefaultTypes.AnyFunction;
    };
    getBuildNumber: DefaultTypes.AnyFunction;
    getDefaultDoubleClickAction: DefaultTypes.AnyFunction;
    getModuleVersions: DefaultTypes.AnyFunction;
    getPath: DefaultTypes.AnyFunction;
    getReleaseChannel: DefaultTypes.AnyFunction;
    getVersion: DefaultTypes.AnyFunction;
    registerUserInteractionHandler: DefaultTypes.AnyFunction;
    relaunch: DefaultTypes.AnyFunction;
    setBadgeCount: DefaultTypes.AnyFunction;
  };
  clipboard: {
    copy: DefaultTypes.AnyFunction;
    copyImage: DefaultTypes.AnyFunction;
    cut: DefaultTypes.AnyFunction;
    paste: DefaultTypes.AnyFunction;
    read: DefaultTypes.AnyFunction;
  };
  clips: {
    deleteClip: DefaultTypes.AnyFunction;
    loadClip: DefaultTypes.AnyFunction;
    loadClipsDirectory: DefaultTypes.AnyFunction;
  };
  crashReporter: {
    getMetadata: DefaultTypes.AnyFunction;
    updateCrashReporter: DefaultTypes.AnyFunction;
  };
  desktopCapture: {
    getDesktopCaptureSources: DefaultTypes.AnyFunction;
  };
  features: {
    declareSupported: DefaultTypes.AnyFunction;
    supports: DefaultTypes.AnyFunction;
  };
  fileManager: {
    basename: DefaultTypes.AnyFunction;
    cleanupTempFiles: DefaultTypes.AnyFunction;
    dirname: DefaultTypes.AnyFunction;
    extname: DefaultTypes.AnyFunction;
    getModuleDataPathSync: DefaultTypes.AnyFunction;
    getModulePath: DefaultTypes.AnyFunction;
    join: DefaultTypes.AnyFunction;
    openFiles: DefaultTypes.AnyFunction;
    readLogFiles: DefaultTypes.AnyFunction;
    readTimeSeriesLogFiles: DefaultTypes.AnyFunction;
    saveWithDialog: DefaultTypes.AnyFunction;
    showItemInFolder: DefaultTypes.AnyFunction;
    showOpenDialog: DefaultTypes.AnyFunction;
  };
  gpuSettings: {
    getEnableHardwareAcceleration: DefaultTypes.AnyFunction;
    setEnableHardwareAcceleration: DefaultTypes.AnyFunction;
  };
  http: {
    getAPIEndpoint: DefaultTypes.AnyFunction;
    makeChunkedRequest: DefaultTypes.AnyFunction;
  };
  ipc: {
    invoke: DefaultTypes.AnyFunction;
    on: DefaultTypes.AnyFunction;
    send: DefaultTypes.AnyFunction;
  };
  isRenderer: boolean;
  nativeModules: {
    canBootstrapNewUpdater: boolean;
    ensureModule: DefaultTypes.AnyFunction;
    requireModule: DefaultTypes.AnyFunction;
  };
  os: {
    arch: string;
    release: string;
  };
  powerMonitor: {
    getSystemIdleTimeMs: DefaultTypes.AnyFunction;
    on: DefaultTypes.AnyFunction;
    removeAllListeners: DefaultTypes.AnyFunction;
    removeListener: DefaultTypes.AnyFunction;
  };
  powerSaveBlocker: {
    blockDisplaySleep: DefaultTypes.AnyFunction;
    cleanupDisplaySleep: DefaultTypes.AnyFunction;
    unblockDisplaySleep: DefaultTypes.AnyFunction;
  };
  process: {
    arch: string;
    env: object;
    platform: string;
  };
  processUtils: {
    flushCookies: DefaultTypes.AnyFunction;
    flushDNSCache: DefaultTypes.AnyFunction;
    flushStorageData: DefaultTypes.AnyFunction;
    getCPUCoreCount: DefaultTypes.AnyFunction;
    getCurrentCPUUsagePercent: DefaultTypes.AnyFunction;
    getCurrentMemoryUsageKB: DefaultTypes.AnyFunction;
    getLastCrash: DefaultTypes.AnyFunction;
    getMainArgvSync: DefaultTypes.AnyFunction;
    purgeMemory: DefaultTypes.AnyFunction;
  };
  remoteApp: {
    dock: {
      setBadge: DefaultTypes.AnyFunction;
      bounce: DefaultTypes.AnyFunction;
      cancelBounce: DefaultTypes.AnyFunction;
    };
    getBuildNumber: DefaultTypes.AnyFunction;
    getDefaultDoubleClickAction: DefaultTypes.AnyFunction;
    getModuleVersions: DefaultTypes.AnyFunction;
    getPath: DefaultTypes.AnyFunction;
    getReleaseChannel: DefaultTypes.AnyFunction;
    getVersion: DefaultTypes.AnyFunction;
    registerUserInteractionHandler: DefaultTypes.AnyFunction;
    relaunch: DefaultTypes.AnyFunction;
    setBadgeCount: DefaultTypes.AnyFunction;
  };
  remotePowerMonitor: {
    getSystemIdleTimeMs: DefaultTypes.AnyFunction;
    on: DefaultTypes.AnyFunction;
    removeAllListeners: DefaultTypes.AnyFunction;
    removeListener: DefaultTypes.AnyFunction;
  };
  safeStorage: {
    decryptString: DefaultTypes.AnyFunction;
    encryptString: DefaultTypes.AnyFunction;
    isEncryptionAvailable: DefaultTypes.AnyFunction;
  };
  setUncaughtExceptionHandler: DefaultTypes.AnyFunction;
  settings: {
    get: DefaultTypes.AnyFunction;
    getSync: DefaultTypes.AnyFunction;
    set: DefaultTypes.AnyFunction;
  };
  spellCheck: {
    getAvailableDictionaries: DefaultTypes.AnyFunction;
    on: DefaultTypes.AnyFunction;
    removeListener: DefaultTypes.AnyFunction;
    replaceMisspelling: DefaultTypes.AnyFunction;
    setLearnedWords: DefaultTypes.AnyFunction;
    setLocale: DefaultTypes.AnyFunction;
  };
  thumbar: { setThumbarButtons: DefaultTypes.AnyFunction };
  userDataCache: {
    cacheUserData: DefaultTypes.AnyFunction;
    deleteCache: DefaultTypes.AnyFunction;
    getCached: DefaultTypes.AnyFunction;
  };
  window: {
    USE_OSX_NATIVE_TRAFFIC_LIGHTS: boolean;
    blur: DefaultTypes.AnyFunction;
    close: DefaultTypes.AnyFunction;
    flashFrame: DefaultTypes.AnyFunction;
    focus: DefaultTypes.AnyFunction;
    fullscreen: DefaultTypes.AnyFunction;
    isAlwaysOnTop: DefaultTypes.AnyFunction;
    maximize: DefaultTypes.AnyFunction;
    minimize: DefaultTypes.AnyFunction;
    restore: DefaultTypes.AnyFunction;
    setAlwaysOnTop: DefaultTypes.AnyFunction;
    setBackgroundThrottling: DefaultTypes.AnyFunction;
    setDevtoolsCallbacks: DefaultTypes.AnyFunction;
    setProgressBar: DefaultTypes.AnyFunction;
    setZoomFactor: DefaultTypes.AnyFunction;
  };
}
export interface Settings {
  showToast: boolean;
  normalizeAddress: boolean;
}

export * as default from "./types";
