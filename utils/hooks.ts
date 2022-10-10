import { useRef } from "react";

export const useElementRef =
  <K extends keyof HTMLElementTagNameMap>() =>
    useRef<HTMLElementTagNameMap[K]>(null);
