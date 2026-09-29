import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../services/api.js";

// Pass a stable loader (declared outside a component or wrapped in useCallback).
export default function useResource(loader) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: "" });
    loader(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: "" });
      },
      (error) => {
        if (!controller.signal.aborted)
          setState({ data: null, loading: false, error: errorMessage(error) });
      },
    );
    return () => controller.abort();
  }, [loader, version]);

  return { ...state, reload };
}
