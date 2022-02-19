import React, { Suspense } from "react";

const ChooseFuse = React.lazy(() => import("./ChooseFuse"));
const FuseProvider = React.lazy(() => import("../../fuse-sdk/helpers/RariContext"));

// TODO Routes
// TODO Replace bigjs to bignumber.js
export default function Fuse() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <FuseProvider>
          <ChooseFuse />
        </FuseProvider>
      </Suspense>
    </div>
  );
}
