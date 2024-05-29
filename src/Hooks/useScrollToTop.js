import { useEffect } from "react";

export const useScrollToTop = (state) => {
  useEffect(() => {
    if (window.scrollY !== 0) {
      window.scrollTo({top : 0, left : 0, behavior : "smooth"});
    }
  }, [state]);
};
