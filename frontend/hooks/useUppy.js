import { useEffect, useRef } from "react";

export const useUppy = (uppyInstance) => {
  const uppyRef = useRef(uppyInstance);

  useEffect(() => {
    return () => uppyRef.current.close();
  }, []);

  return uppyRef.current;
};
