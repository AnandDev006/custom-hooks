import { useReducer } from "react";
import { useSafeDispatch } from "./useSafeDispatch";

function asyncReducer(state, action) {
  switch (action.type) {
    case "PENDING": {
      return { status: "PENDING", data: null, error: null };
    }
    case "RESOLVED": {
      return { status: "RESOLVED", data: action.data, error: null };
    }
    case "REJECTED": {
      return { status: "REJECTED", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const useAsync = (initialState) => {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: "IDLE",
    data: null,
    error: null,
    ...initialState,
  });

  const dispatch = useSafeDispatch(unsafeDispatch);

  const { status, data, error } = state;

  const setData = React.useCallback(
    (data) => dispatch({ type: "RESOLVED", data }),
    [dispatch]
  );
  const setError = React.useCallback(
    (error) => dispatch({ type: "REJECTED", error }),
    [dispatch]
  );

  const run = React.useCallback(
    (promise) => {
      dispatch({ type: "PENDING" });
      promise.then(
        (data) => setData(data),
        (error) => setError(error)
      );
    },
    [dispatch]
  );

  return { run, status, data, error, setData, setError };
};
