type DataSource = { endpoint: string; fetchParams?: RequestInit };

/**
 * Returns the data source for a GraphQL query.
 *
 * The Graph Protocol decentralized network requires the content-type
 * header to be set. This convenience function sets that header.
 *
 * @param endpoint
 * @returns
 */
export const getDataSource = (endpoint: string): DataSource => {
  return {
    endpoint,
    fetchParams: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  };
};
