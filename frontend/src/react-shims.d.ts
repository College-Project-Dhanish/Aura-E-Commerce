declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = any> = (props: P) => any;

  export type FormEvent<T = any> = any;

  export function createContext<T = any>(defaultValue?: T): any;
  export function useContext<T = any>(ctx: any): T;
  export function useState<S = any>(initial: S): [S, (v: S) => void];
  export function useEffect(effect: any, deps?: any[]): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {
    [key: string]: any;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
