import React, { Suspense } from "react";

const FusePools = React.lazy(() => import("./Borrow"));
const FuseProvider = React.lazy(() => import("../../fuse-sdk/helpers/RariContext"));

// TODO Routes
// TODO Replace bigjs to bignumber.js
export function Fuse() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <FuseProvider>
          <FusePools poolId={6} />
        </FuseProvider>
      </Suspense>
    </div>
  );
}
