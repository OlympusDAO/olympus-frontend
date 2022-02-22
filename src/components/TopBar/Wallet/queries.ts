import axios from "axios";
import { gql, request } from "graphql-request";
import { useQuery } from "react-query";
const snapshotUrl = "https://hub.snapshot.org/graphql";
const mediumUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://olympusdao.medium.com/feed";
import { FUSE_POOL_18_ADDRESSES } from "src/constants/addresses";
import { useStaticFuseContract } from "src/hooks/useContract";
import { NetworkId } from "src/networkDetails";
export const ActiveProposals = () => {
  const { data, isFetched, isLoading } = useQuery("ActiveProposals", async () => {
    const data = await request(
      snapshotUrl,
      gql`
        query Proposals {
          proposals(
            first: 20
            skip: 0
            where: { space_in: ["olympusdao.eth"] }
            orderBy: "created"
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            link
            scores
          }
        }
      `,
    );
    return data;
  });
  return { data, isFetched, isLoading };
};

export const MediumArticles = () => {
  const { data, isFetched, isLoading } = useQuery("MediumArticles", async () => {
    return await axios.get(mediumUrl).then(res => {
      return res.data;
    });
  });
  return { data, isFetched, isLoading };
};

export const SupplyRatePerBlock = () => {
  const fuse = useStaticFuseContract(FUSE_POOL_18_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const { data, isFetched, isLoading } = useQuery("FuseSupply", async () => {
    return await fuse.supplyRatePerBlock();
  });
  return { data, isFetched, isLoading };
};
