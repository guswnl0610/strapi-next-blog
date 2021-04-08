import { useEffect, useRef } from "react";

export const useIntersectionObserver = (ref, callback, option = { threshold: 0 }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(callback, option);
    observer.observe(ref.current);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return { observer: observerRef.current };
};
