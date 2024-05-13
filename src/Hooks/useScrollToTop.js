import { useEffect } from "react";

export const useScrollToTop = (state) => {
  useEffect(() => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }, [state]);
};
