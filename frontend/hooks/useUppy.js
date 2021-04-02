import { useEffect, useRef } from "react";

export const useUppy = (uppyInstance, handleComplete) => {
  const uppyRef = useRef(uppyInstance);

  useEffect(() => {
    uppyRef.current.on("complete", handleComplete);

    return () => {
      uppyRef.current.off("complete");
      uppyRef.current.close();
    };
  }, []);

  return uppyRef.current;
};
