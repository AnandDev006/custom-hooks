import { useLayoutEffect, useRef } from "react";

export function useSafeDispatch(dispatch) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const safeDispatch = React.useCallback(
    (...args) => (mounted.current ? dispatch(args) : void 0),
    [dispatch]
  );

  return safeDispatch;
}
