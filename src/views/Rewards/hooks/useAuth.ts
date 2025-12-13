import { useCallback, useState } from "react";
import { LibChainId, useGETAuthVerify, usePOSTAuthGetNonce, usePOSTAuthLogin } from "src/generated/olympusUnits";
import { clearAuthToken, getAuthToken, setAuthToken } from "src/views/Rewards/hooks/customHttpClient";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

export const useAuth = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check if user is authenticated
  const { data: verifyData, refetch: refetchVerify } = useGETAuthVerify({
    query: {
      enabled: !!getAuthToken(),
      retry: false,
    },
  });

  const getNonceMutation = usePOSTAuthGetNonce();
  const loginMutation = usePOSTAuthLogin();

  const isAuthenticated = verifyData?.authenticated || false;

  /**
   * Sign in with Ethereum - full authentication flow
   */
  const signIn = useCallback(async () => {
    if (!address) {
      throw new Error("No wallet connected");
    }

    setIsAuthenticating(true);

    try {
      // Step 1: Get nonce from server
      const nonceResponse = await getNonceMutation.mutateAsync({
        data: {
          address,
          chainId: chain?.id as LibChainId | undefined,
        },
      });

      // Step 2: Sign the message with MetaMask
      const signature = await signMessageAsync({
        message: nonceResponse.message,
      });

      // Step 3: Exchange signature for JWT token
      const loginResponse = await loginMutation.mutateAsync({
        data: {
          address,
          signature,
          message: nonceResponse.message,
        },
      });

      // Step 4: Store token
      setAuthToken(loginResponse.token);

      // Step 5: Verify authentication
      await refetchVerify();

      return loginResponse;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [address, chain?.id, getNonceMutation, loginMutation, signMessageAsync, refetchVerify]);

  /**
   * Sign out - clear token
   */
  const signOut = useCallback(() => {
    clearAuthToken();
    refetchVerify();
  }, [refetchVerify]);

  return {
    isAuthenticated,
    isAuthenticating,
    userAddress: verifyData?.address,
    signIn,
    signOut,
  };
};
