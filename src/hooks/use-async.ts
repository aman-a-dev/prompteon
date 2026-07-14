import { useState, useCallback, useRef, useEffect } from "react";

export interface UseAsyncOptions<TData, TError, TArgs extends unknown[] = []> {
  /** The asynchronous function to execute */
  action: (...args: TArgs) => Promise<TData>;
  /** Callback triggered when the action resolves successfully */
  onSuccess?: (data: TData) => void | Promise<void>;
  /** Callback triggered when the action throws an error */
  onError?: (error: TError) => void | Promise<void>;
  /** Callback triggered when the action completes, regardless of success or failure */
  onSettled?: () => void | Promise<void>;
}

export function useAsync<TData, TError, TArgs extends unknown[] = []>({
  action,
  onSuccess,
  onError,
  onSettled,
}: UseAsyncOptions<TData, TError, TArgs>) {
  const [isLoading, setIsLoading] = useState(false);

  // Keep options in mutable refs to avoid breaking useCallback dependencies on re-renders
  const optionsRef = useRef({ action, onSuccess, onError, onSettled });

  useEffect(() => {
    optionsRef.current = { action, onSuccess, onError, onSettled };
  }, [action, onSuccess, onError, onSettled]);

  const execute = useCallback(async (...args: TArgs): Promise<TData> => {
    setIsLoading(true);
    try {
      const result = await optionsRef.current.action(...args);
      if (optionsRef.current.onSuccess) {
        await optionsRef.current.onSuccess(result);
      }
      return result;
    } catch (err) {
      if (optionsRef.current.onError) {
        await optionsRef.current.onError(err as TError);
      }
      throw err;
    } finally {
      setIsLoading(false);
      if (optionsRef.current.onSettled) {
        await optionsRef.current.onSettled();
      }
    }
  }, []);

  return {
    isLoading,
    execute,
  };
}
