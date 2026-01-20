import { RefObject, useEffect, useMemo, useState } from "react";
import { PrefixKeys, Size, CapitaliseKeys, _use_state, _effect, _memo, PrefixKeysAndCapitalisedAfter } from "@ns-sg/types"


// ========== types
export type UseElementSizeOptions =
  & Partial<
    PrefixKeysAndCapitalisedAfter<"min", Size>
  >


// ========== hook
export const useElementSize = <
  T extends HTMLElement
>(
  ref: RefObject<T>,
  opts?: UseElementSizeOptions
): Size => {

  const { minWidth = 0, minHeight = 0 } = opts ?? {}
    , [size, setSize] = useState<Size>({ width: minWidth, height: minHeight });

  _effect([[ref, minWidth, minHeight]], () => {
    const el = ref.current;
    if (!el) {
      return
    }

    const clamp = (w: number, h: number) => ({
      width: Math.max(minWidth, Math.floor(w)),
      height: Math.max(minHeight, Math.floor(h)),
    })

      , rect = el.getBoundingClientRect()

    setSize(clamp(rect.width, rect.height))

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const cr = entry.contentRect;
      setSize(clamp(cr.width, cr.height));
    });

    ro.observe(el)
    return () => ro.disconnect()
  });

  return _memo([size.width, size.height], () => size);
}
