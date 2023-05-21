import { Box, Button, InputBase, OutlinedInputProps, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement, useRef } from "react";
import Icon from "src/components/library/Icon";
import Token from "src/components/library/Token/Token";
import tokenPath from "src/components/library/Token/tokensLib";

const StyledInputBase = styled(InputBase, { shouldForwardProp: prop => prop !== "inputWidth" })<OHMSwapCardProps>(
  ({ inputWidth }) => ({
    "& .MuiInputBase-input": {
      padding: 0,
      height: "24px",
    },
    "& input": {
      width: `${inputWidth}` || "136px",
      fontSize: "18px",
      "&[type=number]": {
        MozAppearance: "textfield",
      },
      "&::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
    },
  }),
);
export interface OHMSwapCardProps extends OutlinedInputProps {
  id: string;
  endString?: string;
  endStringOnClick?: () => void;
  token?: keyof typeof tokenPath | ReactElement | JSX.Element;
  /*Optionally used if passing an element to token */
  tokenName?: string;
  placeholder?: string;
  usdValue?: string;
  info?: ReactElement | string;
  tokenOnClick?: () => void;
  inputWidth?: string;
}

const SwapCard: FC<OHMSwapCardProps> = ({
  id,
  endString,
  endStringOnClick,
  token,
  placeholder = "0",
  info,
  usdValue,
  tokenOnClick,
  tokenName,
  inputWidth,
  ...props
}) => {
  const theme = useTheme();
  const onClickProps = tokenOnClick ? { onClick: tokenOnClick } : "";
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="476px"
      sx={{ backgroundColor: theme.colors.gray[700] }}
      borderRadius="12px"
      padding="15px"
      onClick={() => {
        ref.current && ref.current.focus();
      }}
    >
      {token && (
        <Box display="flex" flexDirection="row">
          <Box
            display="inline-flex"
            sx={{
              backgroundColor: theme.colors.gray[600],
              "&:hover": { backgroundColor: tokenOnClick ? theme.colors.gray[500] : theme.colors.gray[600] },
              cursor: tokenOnClick ? "pointer" : "default",
            }}
            borderRadius="6px"
            paddingX="9px"
            paddingY="6.5px"
            alignItems="center"
            {...onClickProps}
          >
            {typeof token === "string" ? <Token name={token} sx={{ fontSize: "21px" }} /> : token}

            {(typeof token === "string" || tokenName) && (
              <Typography fontSize="15px" lineHeight="24px" marginLeft="9px">
                {tokenName ? tokenName : token}
              </Typography>
            )}
            {tokenOnClick && <Icon name="arrow-down" sx={{ fontSize: "7px", marginLeft: "10px" }} />}
          </Box>
        </Box>
      )}
      <Box display="flex" flexDirection="row" marginTop="12px" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="row" alignItems="center">
          <StyledInputBase
            id={id}
            sx={{
              color: theme.colors.gray[40],
              fontWeight: 500,
              padding: 0,
              height: "24px",
              maxWidth: "136px",
            }}
            placeholder={placeholder}
            type="number"
            inputWidth={inputWidth}
            {...props}
            inputRef={ref}
          />
          {usdValue && (
            <Box sx={{ color: theme.colors.gray[500] }} fontSize="12px" lineHeight="15px">
              ≈{usdValue}
            </Box>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          sx={{ color: theme.colors.gray[90] }}
          alignItems="center"
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          {info && (
            <Typography fontSize="12px" lineHeight="24px">
              {info}
            </Typography>
          )}
          {endString && (
            <Button
              variant="text"
              style={{
                margin: 0,
                marginLeft: "6px",
                minWidth: 0,
                padding: 0,
                fontWeight: 450,
                fontSize: "12px",
                lineHeight: "12px",
              }}
              onClick={endStringOnClick}
            >
              {""}
              {endString}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SwapCard;
