import { useEffect, useRef } from "react";

interface DebugInfo {
  count: number;
  changedProps: Record<string, { previous: any; current: any }>;
  timeSinceLastRender: number;
  lastRenderTimestamp: number;

  __begin_perfom(key: string): () => void
}

export function useDebugInformation(componentName: string, props: Record<string, any>, logProps: boolean = false): DebugInfo {
  const count = useRenderCount();
  const changedProps = useRef<Record<string, { previous: any; current: any }>>({});
  const previousProps = useRef<Record<string, any>>(props);
  const lastRenderTimestamp = useRef<number>(Date.now());

  const mapPerformance = useRef(new Map<string, { beginTick: number, endTick?: number }>());

  const beginPerfom = (key: string) => {
    mapPerformance.current.set(key, { beginTick: performance.now(), endTick: undefined })

    return () => {
      mapPerformance.current.get(key)!.endTick = performance.now()
    }
  }

  const propKeys = Object.keys({ ...props, ...previousProps.current });
  changedProps.current = propKeys.reduce((obj, key) => {
    if (props[key] === previousProps.current[key]) return obj;
    return {
      ...obj,
      [key]: { previous: previousProps.current[key], current: props[key] },
    };
  }, {});

  const info: DebugInfo = {
    count,
    changedProps: changedProps.current,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
    __begin_perfom: beginPerfom
  };

  useEffect(() => {
    previousProps.current = props;
    lastRenderTimestamp.current = Date.now();
    console.log("[debug-info]", componentName, `count:${info.count}, msLastRender:${info.timeSinceLastRender}, ${Math.floor(performance.now())}`, logProps ? props : '');
    if (mapPerformance.current.size !== 0) {
      const perf: any = {}
      mapPerformance.current.forEach((value, key) => {
        if (value.endTick && value.beginTick) {
          const duration = value.endTick - value.beginTick;
          perf[key] = `${Math.round(duration)}ms`
          mapPerformance.current.delete(key)
        }
      });

      if (Object.values(perf).length > 0)
        console.log(">[debug-info]", 'perform: ', perf);
    }

  });

  return info;
}

export function useRenderCount(): number {
  const count = useRef<number>(1);
  useEffect(() => {
    count.current++
  });
  return count.current;
}
