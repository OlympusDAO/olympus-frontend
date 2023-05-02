import { createHooks } from "@wundergraph/react-query";
import { createClient, Operations, Queries } from "olympusdao-treasury-subgraph-client-test";

const client = createClient(); // Typesafe WunderGraph client

type PaginatedTokenSupplyArray = Exclude<Queries["paginated/tokenSupplies"]["response"]["data"], undefined>;
export type PaginatedTokenSupply = PaginatedTokenSupplyArray[0];

export const { useQuery: useTokenSupplyQuery } = createHooks<Operations>(client);
