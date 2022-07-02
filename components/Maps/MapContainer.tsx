import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Okrug } from "../../pages/viz";
import { MapRegion } from "./MapRegion";
import { Okruzi } from "./Okruzi";

export const MapContainer = ({
  selectedOkrug,
  setSelectedOkrug,
}: {
  selectedOkrug: Okrug | null;
  setSelectedOkrug: Dispatch<SetStateAction<Okrug | null>>;
}) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [width, setWidth] = useState(544);
  const [height, setHeight] = useState(792);
  const [windowHeight, setWindowHeight] = useState(10);

  const resizeSVG = useCallback(() => {
    const svgBondingBox = ref.current?.getBBox();
    if (svgBondingBox) {
      setWidth(svgBondingBox.x + svgBondingBox.width + svgBondingBox.x);
      setHeight(svgBondingBox.y + svgBondingBox.height + svgBondingBox.y);
      setWindowHeight(window.innerHeight);
    }
  }, []);

  useEffect(() => {
    resizeSVG();
    window.addEventListener("resize", resizeSVG);
    return () => window.removeEventListener("resize", resizeSVG);
  }, [resizeSVG]);

  return (
    <div className="top-0 left-0 bottom-0 right-0 mb-10 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        height={windowHeight - 250}
        ref={ref}
      >
        <g>
          {Okruzi.map((okrug) => (
            <MapRegion
              svgPath={okrug.path}
              handleClick={() => setSelectedOkrug(okrug)}
              selected={selectedOkrug?.id === okrug.id}
              fillColor="#443355"
              strokeColor="#fff"
              key={okrug.id}
              strokeWidth="1px"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
