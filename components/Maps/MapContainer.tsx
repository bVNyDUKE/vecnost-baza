import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Okrug, PersonsPerOkrugStat } from "../../pages/viz";
import { MapRegion } from "./MapRegion";
import { Okruzi } from "./Okruzi";

export const MapContainer = ({
  selectedOkrugId,
  setSelectedOkrug,
  personsPerOkrug,
}: {
  selectedOkrugId: number | null;
  setSelectedOkrug: Dispatch<SetStateAction<Okrug | null>>;
  personsPerOkrug: PersonsPerOkrugStat[] | null;
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

  const getFillColor = useCallback(
    (okrugId: number): string => {
      const count =
        personsPerOkrug?.find((x) => x.okrug_id === okrugId)?.count || 0;
      switch (true) {
        case count > 0 && count <= 100:
          return "#f6eee0";
        case count > 100 && count <= 1000:
          return "#e4b7a0";
        case count > 1000 && count <= 3000:
          return "#c38370";
        case count > 5000:
          return "#A45C40";
        default:
          return "#f9f1f0";
      }
    },
    [personsPerOkrug]
  );

  const handleClick = useCallback(
    (okrug: Okrug) => {
      if (selectedOkrugId === okrug.id) {
        setSelectedOkrug(null);
      } else {
        setSelectedOkrug(okrug);
      }
    },
    [selectedOkrugId, setSelectedOkrug]
  );

  return (
    <div className="top-0 left-0 bottom-0 right-0 mb-10 flex items-center justify-center px-1 md:pr-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        height={windowHeight - 250}
        ref={ref}
      >
        <g>
          {Okruzi.map((okrug) => (
            <MapRegion
              svgPath={okrug.path}
              handleClick={() => handleClick(okrug)}
              selected={selectedOkrugId === okrug.id}
              fillColor={getFillColor(okrug.id)}
              strokeColor={selectedOkrugId === okrug.id ? "#fff" : "#000"}
              key={okrug.id}
              strokeWidth={selectedOkrugId === okrug.id ? "2px" : "1px"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
