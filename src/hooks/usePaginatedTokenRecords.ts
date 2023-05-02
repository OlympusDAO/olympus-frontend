import { createHooks } from "@wundergraph/react-query";
import { createClient, Operations, Queries } from "olympusdao-treasury-subgraph-client-test";

const client = createClient(); // Typesafe WunderGraph client

type PaginatedTokenRecordArray = Exclude<Queries["paginated/tokenRecords"]["response"]["data"], undefined>;
export type PaginatedTokenRecord = PaginatedTokenRecordArray[0];

export const { useQuery: useTokenRecordQuery } = createHooks<Operations>(client);
