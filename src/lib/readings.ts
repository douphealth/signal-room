import { queryOptions } from "@tanstack/react-query";
import { getReadings } from "./status.functions";

export const REFRESH = 60_000;

export const readingsQuery = queryOptions({
  queryKey: ["readings"],
  queryFn: () => getReadings(),
  refetchInterval: REFRESH,
  staleTime: 30_000,
});
