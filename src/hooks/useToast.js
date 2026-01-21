import { useState, useCallback } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const success = useCallback((message) => {
    showToast(message, "success");
  }, [showToast]);

  const error = useCallback((message) => {
    showToast(message, "error");
  }, [showToast]);

  const warning = useCallback((message) => {
    showToast(message, "warning");
  }, [showToast]);

  const info = useCallback((message) => {
    showToast(message, "info");
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
