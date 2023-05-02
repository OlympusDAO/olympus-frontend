import { createHooks } from "@wundergraph/react-query";
import { createClient, Operations } from "olympusdao-treasury-subgraph-client-test";

const client = createClient(); // Typesafe WunderGraph client

export const { useQuery: useTokenRecordQuery } = createHooks<Operations>(client);
