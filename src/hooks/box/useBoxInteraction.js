import { useState } from "react";

export const useBoxInteraction = () => {
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  const handleClick = () => click(!clicked);
  const handlePointerOver = (event) => {
      event.stopPropagation();
      hover(true);
  };
  const handlePointerOut = () => hover(false);

  return {
      hovered,
      clicked,
      handleClick,
      handlePointerOver,
      handlePointerOut
  };
};