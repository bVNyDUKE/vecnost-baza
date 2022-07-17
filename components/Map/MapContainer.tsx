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
import { Okruzi } from "./MapData";

export const MapContainer = ({
  selectedOkrugId,
  setSelectedOkrug,
  setShowModal,
  personsPerOkrug,
}: {
  selectedOkrugId: number | null;
  setSelectedOkrug: Dispatch<SetStateAction<Okrug | null>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
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
      setWindowHeight(window.outerHeight);
    }
  }, []);

  useEffect(() => {
    resizeSVG();
    window.addEventListener("resize", resizeSVG);
    return () => window.removeEventListener("resize", resizeSVG);
  }, [resizeSVG]);

  const getFillColor = (okrugId: number): string => {
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
  };

  const handleClick = (okrug: Okrug) => {
    if (selectedOkrugId === okrug.id) {
      setShowModal((prev) => !prev);
    } else {
      setSelectedOkrug(okrug);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      height={windowHeight - 250}
      ref={ref}
      className="px-2 lg:w-1/2"
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
  );
};
