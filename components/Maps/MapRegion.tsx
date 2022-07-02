import { useState } from "react";

export const MapRegion = ({
  svgPath,
  fillColor,
  strokeColor,
  strokeWidth,
  handleClick,
  selected,
}: {
  svgPath: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: string;
  handleClick: () => void;
  selected: boolean;
}) => {
  const style = { strokeWidth };
  const [hovered, setHovered] = useState(false);
  const fill = selected ? "#ff3301" : hovered ? fillColor : "#440000";

  return (
    <path
      d={svgPath}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      fill={fill}
      stroke={strokeColor}
      style={style}
    />
  );
};
