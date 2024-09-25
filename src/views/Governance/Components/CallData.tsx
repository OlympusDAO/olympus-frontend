//@ts-nocheck

import { defaultAbiCoder, FunctionFragment, Interface, TransactionDescription } from "@ethersproject/abi";
import { Box, Typography } from "@mui/material";
import { InfoNotification } from "@olympusdao/component-library";
import { guessAbiEncodedData } from "@openchainxyz/abi-guesser";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { fetchFunctionInterface } from "src/views/Governance/helpers/fetchFunctionInterface";

export const CallData = ({
  calldata,
  target,
  value,
  index,
  signature,
}: {
  calldata: string;
  target: string;
  value: string;
  index: number;
  signature: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fnDescription, setFnDescription] = useState<TransactionDescription>();

  const _getAllPossibleDecoded = (functionsArr: string[], calldata: string) => {
    let decodedSuccess = false;
    for (let i = 0; i < functionsArr.length; i++) {
      const fn = functionsArr[i];
      const _abi = [`function ${fn}`];

      try {
        decodedSuccess = _decodeWithABI(_abi, calldata);
      } catch {
        continue;
      }
    }

    if (decodedSuccess) {
      console.log("Decoded Successfully");
    } else {
      console.log("Decoding Failed");
    }
  };

  const _decodeWithABI = (_abi: any, _calldata?: string) => {
    let decodedSuccess = false;

    const iface = new Interface(_abi);
    if (!_calldata) return decodedSuccess;

    const res = iface.parseTransaction({ data: _calldata });
    if (res === null) {
      return decodedSuccess;
    }

    console.log({ fnDescription: res });
    setFnDescription(res);

    decodedSuccess = true;
    return decodedSuccess;
  };

  const decodeWithSelector = async () => {
    if (!calldata) return;
    setIsLoading(true);

    const selector = calldata.slice(0, 10);
    try {
      const results = await fetchFunctionInterface(selector);

      if (results.length > 0) {
        // can have multiple entries with the same selector
        _getAllPossibleDecoded(results, calldata);
      } else {
        console.log("Can't fetch function interface");
      }

      setIsLoading(false);
    } catch {
      try {
        // try decoding the `abi.encode` custom bytes
        const paramTypes = guessAbiEncodedData(calldata)!;
        console.log({ paramTypes });

        const abiCoder = defaultAbiCoder;
        const decoded = abiCoder.decode(paramTypes, calldata);

        console.log({ decoded });

        const _fnDescription: TransactionDescription = {
          name: "",
          args: decoded,
          signature: "abi.encode",
          value: BigNumber.from(0),
          functionFragment: FunctionFragment.from({
            inputs: paramTypes,
            name: "test",
            outputs: [],
            type: "function",
            stateMutability: "nonpayable",
          }),
        };

        setFnDescription(_fnDescription);

        if (!decoded || decoded.length === 0) {
          console.log("Can't Decode Calldata");
        }
      } catch (e) {
        try {
          // try decoding just the params of the calldata
          const encodedParams = "0x" + calldata.slice(10);
          const paramTypes = guessAbiEncodedData(encodedParams)!;
          console.log({ paramTypes });

          const abiCoder = defaultAbiCoder;
          const decoded = abiCoder.decode(paramTypes, encodedParams);

          console.log({ decoded });

          const _fnDescription: TransactionDescription = {
            name: "",
            args: decoded,
            signature: "abi.encode",
            value: BigNumber.from(0),
            functionFragment: FunctionFragment.from({
              inputs: paramTypes,
              name: "test",
              outputs: [],
              type: "function",
              stateMutability: "nonpayable",
            }),
          };

          setFnDescription(_fnDescription);

          if (!decoded || decoded.length === 0) {
            console.log("Can't Decode Calldata");
          }
        } catch (ee) {
          console.error(e);
          console.error(ee);
          console.log("Decoding Failed");
        }
      }

      setIsLoading(false);
    }
  };
  useEffect(() => {
    decodeWithSelector();
  }, []);

  return (
    <div>
      <Typography fontWeight={600}>Function {index + 1}</Typography>
      {fnDescription ? (
        <Box>
          {fnDescription.signature ? (
            <Box>
              <Typography fontWeight={600} mt="12px">
                Signature:
              </Typography>
              <Typography fontFamily="monospace">{fnDescription.signature}</Typography>
            </Box>
          ) : (
            <></>
          )}
          <Typography fontWeight={600} mt="12px">
            Calldata:
          </Typography>
          {fnDescription.functionFragment.inputs.map((input, i) => {
            const value = fnDescription.args[i];
            return (
              <Box key={i} display="flex" gap="4px" mt="3px">
                <Typography fontFamily="monospace" width="100px">
                  {input.type}:
                </Typography>
                <Typography fontFamily="monospace">{value}</Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <>
          <InfoNotification>Unable to Decode Calldata</InfoNotification>
          <Typography fontWeight={600} mt="12px">
            Raw Calldata:
          </Typography>
          <Box display="flex" flexDirection="column" gap="8px" sx={{ overflowWrap: "anywhere" }}>
            <Typography fontFamily="monospace">{calldata}</Typography>
          </Box>
        </>
      )}
      <Typography fontWeight={600} mt="12px">
        Signature:
      </Typography>
      <Typography fontFamily="monospace">{signature}</Typography>
      <Typography fontWeight={600} mt="12px">
        Target:
      </Typography>
      <Typography fontFamily="monospace">{target}</Typography>
      <Typography fontWeight={600} mt="12px">
        Value:
      </Typography>
      <Typography fontFamily="monospace">{value}</Typography>
    </div>
  );
};
