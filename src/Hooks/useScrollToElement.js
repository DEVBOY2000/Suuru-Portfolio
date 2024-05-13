import { useEffect } from "react";

export const useScrollToElement = (element, state) => {
  useEffect(() => {
    const elementOffset = document.getElementById(element).offsetTop;
    const navbarHeight = document.getElementById("navbar").offsetHeight;
    if (window.scrollY < elementOffset && state) {
      window.scrollTo({
        top: elementOffset - navbarHeight - 24,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [state]);
};
