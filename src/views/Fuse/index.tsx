import React, { Suspense } from "react";

const FusePools = React.lazy(() => import("./Fuse"));
const FuseProvider = React.lazy(() => import("../../fuse-sdk/helpers/RariContext"));

// TODO Routes
// TODO Replace bigjs to bignumber.js
export default function Fuse({ poolId }: { poolId: number }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <FuseProvider>
          <FusePools poolId={poolId} />
        </FuseProvider>
      </Suspense>
    </div>
  );
}
