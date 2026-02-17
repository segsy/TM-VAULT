declare module 'react' {
  export type ReactNode = unknown;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export interface FC<P = object> {
    (props: P): ReactNode;
  }
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: unknown[]): T;
  export function useCallback<T extends (...args: never[]) => unknown>(callback: T, deps: unknown[]): T;
}

declare module 'react-native' {
  type RNComponent = (props: any) => any;
  export const ActivityIndicator: RNComponent;
  export const Modal: RNComponent;
  export const Pressable: RNComponent;
  export const RefreshControl: RNComponent;
  export const SafeAreaView: RNComponent;
  export const ScrollView: RNComponent;
  export const Text: RNComponent;
  export const TextInput: RNComponent;
  export const View: RNComponent;
  export const StyleSheet: { create: <T>(styles: T) => T };
}

declare module 'expo-status-bar' {
  type ExpoComponent = (props: any) => any;
  export const StatusBar: ExpoComponent;
}

declare module 'expo-haptics' {
  export const notificationAsync: (...args: unknown[]) => Promise<void>;
  export const impactAsync: (...args: unknown[]) => Promise<void>;
  export const NotificationFeedbackType: { Success: unknown; Error: unknown };
  export const ImpactFeedbackStyle: { Light: unknown; Medium: unknown };
}

declare module 'react-native-confetti-cannon' {
  const ConfettiCannon: (props: any) => any;
  export default ConfettiCannon;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
  };
  export default AsyncStorage;
}

declare function setTimeout(handler: (...args: any[]) => void, timeout?: number): number;

declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number;
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
