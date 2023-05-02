import { createHooks } from "@wundergraph/react-query";
import { createClient, Operations, Queries } from "olympusdao-treasury-subgraph-client-test";

const client = createClient(); // Typesafe WunderGraph client

type PaginatedProtocolMetricArray = Exclude<Queries["paginated/protocolMetrics"]["response"]["data"], undefined>;
export type PaginatedProtocolMetric = PaginatedProtocolMetricArray[0];

export const { useQuery: useProtocolMetricQuery } = createHooks<Operations>(client);
