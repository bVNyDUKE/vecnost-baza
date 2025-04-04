import {
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { supabase } from "../lib/supabaseClient";
import { IGraveLocations, IMapProps } from "../types";

export async function getStaticProps() {
  const { data } = await supabase
    .from<IGraveLocations>("groblje")
    .select("id, name, position")
    .not("position", "is", null);

  return { props: { data }, revalidate: 60 * 60 * 24 };
}

const Map = ({ children, ...props }: IMapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: props.center,
        zoom: props.zoom,
        mapId: process.env.NEXT_PUBLIC_MAPS_ID,
        renderingType: google.maps.RenderingType.VECTOR,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: "",
      });

      const markers = props.locations.map((location, i) => {
        const label = ++i;
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: newMap,
          position: location.position,
          title: label.toString(),
        });

        const infoContent = `<div class="py-4 px-2">
          <h1 class="font-bold text-lg">${location.name}</h1>
          <a class="underline hover:cursor-pointer" href="/pretraga?ime=all&groblje=${location.id}">Pretrazi ovo groblje</h1>
            </div>`;

        marker.addListener("click", () => {
          infoWindow.setContent(infoContent);
          infoWindow.open(newMap, marker);
        });

        return marker;
      });

      new MarkerClusterer({ map: newMap, markers });
      setMap(newMap);
    }
  }, [ref, map, props.center, props.zoom, props.locations]);

  return (
    <>
      <div ref={ref} style={{ flexGrow: "1", height: "100%" }} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // @ts-expect-error set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

const LoadingScreen = ({ status }: { status: Status }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-200">
    <p className="text-lg font-bold">{status}</p>
  </div>
);

export default function MapPage({ data }: { data: IGraveLocations[] }) {
  const center = { lat: 44.628924, lng: 20.643159 };
  const zoom = 7;

  if (!process.env.NEXT_PUBLIC_MAPS_KEY) {
    throw new Error("missing maps key");
  }

  return (
    <div className="-mt-10 flex h-screen">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_MAPS_KEY}
        render={(status: Status) => <LoadingScreen status={status} />}
        libraries={["core", "maps", "marker"]}
      >
        <Map center={center} zoom={zoom} locations={data} />
      </Wrapper>
    </div>
  );
}
