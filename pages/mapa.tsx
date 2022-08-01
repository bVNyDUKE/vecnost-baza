import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GetServerSideProps } from "next";
import { supabase } from "../lib/supabaseClient";

type GraveLocations = {
  id: number;
  name: string;
  position: google.maps.LatLngLiteral;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await supabase
    .from<GraveLocations>("groblje")
    .select("id, name, position")
    .not("position", "is", null);

  return { props: { data } };
};

interface MapProps extends google.maps.MapOptions {
  locations: GraveLocations[];
  children?: React.ReactNode;
}

const Map = ({ children, ...props }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: props.center,
        zoom: props.zoom,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: "",
      });

      const markers = props.locations.map((location, i) => {
        const label = ++i;
        const marker = new google.maps.Marker({
          position: location.position,
          label: label.toString(),
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
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
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

export default function MapPage({ data }: { data: GraveLocations[] }) {
  const center = { lat: 44.628924, lng: 20.643159 };
  const zoom = 7;

  return (
    <div className="flex h-screen">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_MAPS_KEY!}
        render={(status: Status) => <LoadingScreen status={status} />}
      >
        <Map center={center} zoom={zoom} locations={data} />
      </Wrapper>
    </div>
  );
}
