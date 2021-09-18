// export { default as useBalance } from "./Balance";
// export { default as useContractExistsAtAddress } from "./ContractExistsAtAddress";
// export { default as useContractLoader } from "./ContractLoader";
// export { default as useContractReader } from "./ContractReader";
// export { default as useCustomContractLoader } from "./CustomContractLoader";
// export { default as useDebounce } from "./Debounce";
// export { default as useEventListener } from "./EventListener";
// export { default as useExchangePrice } from "./ExchangePrice";
// export { default as useExternalContractLoader } from "./ExternalContractLoader";
// export { default as useGasPrice } from "./GasPrice";
// export { default as useLocalStorage } from "./LocalStorage";
// export { default as useLookupAddress } from "./LookupAddress";
// export { default as useNonce } from "./Nonce";
// export { default as useOnBlock } from "./OnBlock";
// export { default as usePoller } from "./Poller";
// export { default as useResolveName } from "./ResolveName";
// export { default as useTokenList } from "./TokenList";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";

// export { default as useUserProvider } from "./UserProvider";
export { useWeb3Context, useAddress } from "./web3Context";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { default as useBonds } from "./Bonds";
