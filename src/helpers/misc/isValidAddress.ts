import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";

export const isValidAddress = (address?: string) => address && isAddress(address) && address !== AddressZero;
