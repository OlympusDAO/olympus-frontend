export function truncateEthereumAddress(address: string, length = 4) {
  if (!address || address.length < 11) {
    return address; // Return the original address if it's too short to truncate
  }
  return `${address.substring(0, length + 2)}...${address.substring(address.length - length)}`;
}
