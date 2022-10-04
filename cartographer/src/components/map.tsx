import { Button, Input, Text } from "@chakra-ui/react";
import mapboxgl, { LngLat, Map as MapType } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { Activity } from "../types/activity";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlY3IiLCJhIjoiY2w4N3Z0Mm9yMTRqZDNvb2VjcnZ3b3U2cCJ9.MeqL89dZc-ike3Izpn5M_Q";

enum AppStatus {
  Loading = "loading",
  LoadedMap = "loaded map",
  LoadedActivity = "loaded activity",
  Playing = "playing",
  Done = "done",
}

enum AnimationStyle {
  FullMap = "full-map",
  DotFollow = "dot-follow",
}

interface AnimationOptions {
  frameInterval: number;
  fps: number;
  stepSize: number;
}

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<null | MapType>(null);
  const [activityId, setActivityId] = useState<string>("7890716899");
  const [activity, setActivity] = useState<null | Activity>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.Loading);
  const [activityLoaded, setActivityLoaded] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);

  const setZoomAndCenterForCoordinates = () => {
    setRouteCoordinates(activity!.latlng);
    const bounds = new mapboxgl.LngLatBounds();

    activity!.latlng.forEach((coord) => {
      bounds.extend([coord[0], coord[1]]);
    });
    map.current!.fitBounds(bounds, { duration: 0, padding: 50 });
    console.log(map.current!.getZoom());
    setRouteCoordinates([activity!.latlng[0]]);
  };

  const lineStringForCoordinates = (coords: LngLat[]): any => {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
    };
  };

  const pointForCoordinates = (coords: LngLat[]): any => {
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: coords[coords.length - 1],
      },
    };
  };

  const delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const executeFullMapAnimation = (
    options: AnimationOptions,
    onComplete: () => void = () => {}
  ) => {
    let i = 1;

    const timer = setInterval(async () => {
      if (i < activity!.latlng.length) {
        setRouteCoordinates(activity!.latlng.slice(0, i));
        i += options.stepSize;
      } else {
        setRouteCoordinates(activity!.latlng);
        window.clearInterval(timer);
        // Pause for a second after completing the animation
        await delay(1000);
        setAppStatus(AppStatus.Done);
      }
    }, options.frameInterval);
  };

  const executeDotFollowAnimation = (
    options: AnimationOptions,
    onComplete: () => void = () => {}
  ) => {
    let i = 1;

    const timer = setInterval(async () => {
      if (i < activity!.latlng.length) {
        setRouteCoordinates(activity!.latlng.slice(0, i));
        // @ts-ignore
        map.current!.panTo(
          {
            lng: activity!.latlng[i][0],
            lat: activity!.latlng[i][1],
          },
          { duration: 100 }
        );
        i += options.stepSize;
      } else {
        setRouteCoordinates(activity!.latlng);
        // @ts-ignore
        map.current!.panTo({
          lng: activity!.latlng[i][0],
          lat: activity!.latlng[i][1],
        });
        window.clearInterval(timer);
        // Pause for a second after completing the animation
        await delay(1000);
        setAppStatus(AppStatus.Done);
      }
    }, options.frameInterval);
  };

  const animateRoute = async (
    animationStyle: AnimationStyle = AnimationStyle.FullMap
  ) => {
    setAppStatus(AppStatus.Playing);

    const frameInterval = 10;
    const fps = 1000 / frameInterval;
    const stepSize = Math.ceil(activity!.latlng.length / (fps * 20));

    const animationOptions: AnimationOptions = {
      frameInterval,
      fps,
      stepSize,
    };
    // Pause for a second before animating
    await delay(1000);

    switch (animationStyle) {
      case AnimationStyle.FullMap:
        executeFullMapAnimation(animationOptions);
        break;
      case AnimationStyle.DotFollow:
        executeDotFollowAnimation(animationOptions);
        break;
    }
  };

  const loadActivity = () => {
    fetch(
      `http://localhost:8000/strava/activity?activity_id=${activityId}&athlete_id=foo`
    )
      .then((res) => res.json())
      .then((json) => {
        const activity = json;
        activity.latlng = activity.latlng.map((l: number[]) => [l[1], l[0]]);
        setActivity(json);
        setActivityLoaded(true);
        setAppStatus(AppStatus.LoadedActivity);
      });
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      preserveDrawingBuffer: true,
    });

    map.current.on("load", () => {
      map.current!.addSource("route", {
        type: "geojson",
        data: lineStringForCoordinates([]),
      });

      map.current!.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "red",
          "line-width": 5,
        },
      });

      map.current!.addSource("position-marker", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
        },
      });

      map.current!.addLayer({
        id: "position-marker-shadow",
        type: "circle",
        source: "position-marker",
        paint: {
          "circle-radius": 10,
          "circle-color": "black",
          "circle-opacity": 0.75,
          "circle-blur": 1,
        },
      });

      map.current!.addLayer({
        id: "position-marker-outer",
        type: "circle",
        source: "position-marker",
        paint: {
          "circle-radius": 6,
          "circle-color": "white",
          "circle-opacity": 1,
        },
      });

      map.current!.addLayer({
        id: "position-marker-inner",
        type: "circle",
        source: "position-marker",
        paint: {
          "circle-radius": 5,
          "circle-color": "blue",
          "circle-opacity": 1,
        },
      });
      setAppStatus(AppStatus.LoadedMap);
      setMapLoaded(true);
    });
  }, [mapContainer]);

  useEffect(() => {
    if (!mapLoaded || !activityLoaded) return;
    setZoomAndCenterForCoordinates();
  }, [mapLoaded, activityLoaded]);

  useEffect(() => {
    const routeSource = map.current!.getSource("route");
    const pointSource = map.current!.getSource("position-marker");
    if (!routeSource || !pointSource) return;
    // @ts-ignore
    routeSource.setData(lineStringForCoordinates(routeCoordinates));
    // @ts-ignore
    pointSource.setData(pointForCoordinates(routeCoordinates));
  }, [routeCoordinates]);

  return (
    <div className=" h-full w-full flex flex-col overflow-hidden">
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
      <div
        className={`${
          [AppStatus.Playing, AppStatus.Done].includes(appStatus) && "hidden"
        } p-8 flex flex-col gap-2`}
      >
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Activity ID"
            type="text"
            value={activityId}
            onChange={(event: React.FormEvent<HTMLInputElement>): void => {
              setActivityId(event.currentTarget.value);
            }}
          />
          <Button
            id="load-activity-button"
            className="w-64"
            onClick={loadActivity}
          >
            Load Activity
          </Button>
        </div>
        <Button
          id="play-button"
          className="w-full"
          onClick={() => {
            animateRoute(AnimationStyle.FullMap);
          }}
        >
          Play
        </Button>
        <div>
          <Text>
            Status: <span id="status-text">{appStatus}</span>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Map;
