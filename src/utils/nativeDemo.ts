import { NativeModules, Platform } from 'react-native';

type NativeDemoModule = {
  open: () => void;
};

const mod = (NativeModules as Record<string, unknown>).FrontRowNativeDemo as
  | NativeDemoModule
  | undefined;

export function openNativeDemo(): void {
  if (mod?.open) {
    mod.open();
    return;
  }
  if (__DEV__) {
    console.warn(
      `FrontRowNativeDemo native module is not registered on ${Platform.OS}. ` +
        `Run \`npx expo prebuild\` and rebuild the native app.`,
    );
  }
}

export const isNativeDemoAvailable = !!mod?.open;
