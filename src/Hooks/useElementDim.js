import { useEffect, useState } from "react";

export const useElementDim = (element, media) => {
  const [dimentions, setDimentions] = useState({
    width: 0,
    height: 0,
    offsetTop: 0,
  });

  useEffect(() => {
    const targetElement = document.getElementById(`${element}`);

    const elementObj = {
      width: targetElement.offsetWidth,
      height: targetElement.offsetHeight,
      offsetTop: targetElement.offsetTop,
    };

    setDimentions(elementObj);
  }, [media]);

  return dimentions;
};
