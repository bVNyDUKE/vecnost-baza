import React, { useEffect, useRef, useState } from "react";
import {
  withPageAuth,
  supabaseServerClient,
} from "@supabase/supabase-auth-helpers/nextjs";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

type GraveLocations = {
  name: string;
  position: google.maps.LatLngLiteral;
};

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps(ctx) {
    const { data } = await supabaseServerClient(ctx)
      .from<GraveLocations>("groblje")
      .select("name, position")
      .not("position", "is", null);

    return { props: { data } };
  },
});

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
      })

      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      })

      const markers = props.locations.map((location, i) => {
        const label = i.toString();
        const marker = new google.maps.Marker({
          position: location.position,
          label,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(location.name)
          infoWindow.open(newMap, marker)
        });

        return marker;
      })

      new MarkerClusterer({ map: newMap, markers })
      setMap(newMap)
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

export default function MapPage({ data }: { data: GraveLocations[] }) {
  const center = { lat: 44.628924, lng: 20.643159 };
  const zoom = 7;

  return (
    <div className="h-screen flex">
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_MAPS_KEY!}
        render={(status: Status) => <h1>{status}</h1>}
      >
        <Map center={center} zoom={zoom} locations={data} />
      </Wrapper>
    </div>
  );
}
