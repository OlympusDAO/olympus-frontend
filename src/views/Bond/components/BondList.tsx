import {
  Box,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { ReactComponent as ArrowUp } from "src/assets/icons/arrow-up.svg";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { Token } from "src/helpers/contracts/Token";
import { useScreenSize } from "src/hooks/useScreenSize";
import { NetworkId } from "src/networkDetails";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { BondDuration } from "src/views/Bond/components/BondDuration";
import { BondInfoText } from "src/views/Bond/components/BondInfoText";
import { BondPrice } from "src/views/Bond/components/BondPrice";
import { Bond } from "src/views/Bond/hooks/useBond";

export const BondList: React.VFC<{ bonds: Bond[]; isInverseBond: boolean }> = ({ bonds, isInverseBond }) => {
  const isSmallScreen = useScreenSize("md");
  if (bonds.length === 0)
    return (
      <Box display="flex" justifyContent="center">
        <Typography variant="h4">No active bonds</Typography>
      </Box>
    );

  if (isSmallScreen)
    return (
      <>
        <Box my="24px" textAlign="center">
          <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
            <BondInfoText isInverseBond={isInverseBond} />
          </Typography>
        </Box>

        {sortByDiscount(bonds).map(bond => (
          <BondCard key={bond.id} bond={bond} isInverseBond={isInverseBond} />
        ))}
      </>
    );

  return (
    <>
      <BondTable isInverseBond={isInverseBond}>
        {sortByDiscount(bonds).map(bond => (
          <BondRow key={bond.id} bond={bond} isInverseBond={isInverseBond} />
        ))}
      </BondTable>

      <Box mt="24px" textAlign="center" width="70%" mx="auto">
        <Typography variant="body2" color="textSecondary" style={{ fontSize: "1.075em" }}>
          {isInverseBond && <BondInfoText isInverseBond={isInverseBond} />}
        </Typography>
      </Box>
    </>
  );
};

const BondCard: React.VFC<{ bond: Bond; isInverseBond: boolean }> = ({ bond, isInverseBond }) => {
  // NOTE (appleseed): adding const here for asset names since translations cannot properly...
  // ... interpolate the nested bond object strings
  const quoteTokenName = bond.quoteToken.name;
  const baseTokenName = bond.baseToken.name;

  return (
    <Box id={bond.id + `--bond`} mt="32px">
      <Box display="flex" alignItems="center">
        <TokenStack tokens={bond.quoteToken.icons} />

        <Box display="flex" flexDirection="column" ml="8px">
          <Typography>{bond.quoteToken.name}</Typography>

          <Link href={bond.quoteToken.purchaseUrl} target="_blank" rel="noopener noreferrer">
            <Box display="flex" alignItems="center">
              <Typography>Get Asset</Typography>

              <Box ml="4px">
                <SvgIcon component={ArrowUp} />
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="16px">
        <Typography>Price</Typography>

        <Typography>
          {bond.isSoldOut ? (
            "--"
          ) : (
            <BondPrice
              price={bond.price.inBaseToken}
              isInverseBond={isInverseBond}
              symbol={isInverseBond ? baseTokenName : quoteTokenName}
            />
          )}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>Discount</Typography>

        <Typography>{bond.isSoldOut ? "--" : <BondDiscount discount={bond.discount} />}</Typography>
      </Box>

      {isInverseBond && (
        <Box display="flex" justifyContent="space-between" mt="8px">
          <Typography>Payout</Typography>

          <Typography>{bond.baseToken.name}</Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>Max Payout</Typography>
        {`${payoutTokenCapacity(bond, isInverseBond)}${
          bond.baseToken.name !== bond.quoteToken.name ? ` (${quoteTokenCapacity(bond)})` : ``
        }`}
      </Box>

      {!isInverseBond && (
        <Box display="flex" justifyContent="space-between" mt="8px">
          <Typography>Duration</Typography>

          <Typography>
            <BondDuration duration={bond.duration} />
          </Typography>
        </Box>
      )}

      <Box mt="16px">
        <Link
          component={NavLink}
          to={
            isInverseBond
              ? `/bonds/${bond.isV3Bond ? `v3/` : ""}inverse/${bond.id}`
              : `/bonds/${bond.isV3Bond ? `v3/` : ""}${bond.id}`
          }
        >
          <TertiaryButton fullWidth>
            Bond {quoteTokenName} for {baseTokenName}
          </TertiaryButton>
        </Link>
      </Box>
    </Box>
  );
};

const BondTable: React.FC<{ isInverseBond: boolean }> = ({ children, isInverseBond }) => (
  <TableContainer>
    <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
      <TableHead>
        <TableRow>
          <TableCell style={{ width: isInverseBond ? "146px" : "162px", padding: "8px 0" }}>Token</TableCell>

          {isInverseBond && <TableCell style={{ width: "146px", padding: "8px 0" }}>Payout Asset</TableCell>}

          <TableCell style={{ padding: "8px 0", width: "82px" }}>Price</TableCell>

          <TableCell style={{ padding: "8px 0", width: "91px" }}>Discount</TableCell>
          <TableCell style={{ padding: "8px 0" }}>Max Payout</TableCell>
          {!isInverseBond && <TableCell style={{ padding: "8px 0" }}>Duration</TableCell>}
        </TableRow>
      </TableHead>

      <TableBody>{children}</TableBody>
    </Table>
  </TableContainer>
);
const quoteTokenCapacity = (bond: Bond) => {
  const quoteTokenCapacity = `${(bond.maxPayout.inQuoteToken.lt(bond.capacity.inQuoteToken)
    ? bond.maxPayout.inQuoteToken
    : bond.capacity.inQuoteToken
  ).toString({ decimals: 3, format: true })}${" "}
  ${bond.quoteToken.name}`;
  return quoteTokenCapacity;
};
const payoutTokenCapacity = (bond: Bond, isInverseBond: boolean) => {
  const payoutFormatter = Intl.NumberFormat("en", { notation: "compact" });
  const payoutTokenCapacity = `${(bond.maxPayout.inBaseToken.lt(bond.capacity.inBaseToken)
    ? bond.maxPayout.inBaseToken
    : bond.capacity.inBaseToken
  ).toString()}`;
  return `${payoutFormatter.format(parseInt(payoutTokenCapacity))} ${" "}
  ${isInverseBond ? bond.baseToken.name : `OHM`}`;
};
const BondRow: React.VFC<{ bond: Bond; isInverseBond: boolean }> = ({ bond, isInverseBond }) => {
  const quoteTokenName = bond.quoteToken.name;
  const baseTokenName = bond.baseToken.name;

  return (
    <TableRow id={bond.id + `--bond`} data-testid={bond.id + `--bond`}>
      <TableCell style={{ padding: "8px 0" }}>
        <TokenIcons token={bond.quoteToken} />
      </TableCell>

      {isInverseBond && (
        <TableCell style={{ padding: "8px 0" }}>
          <TokenIcons token={bond.baseToken} explorer />
        </TableCell>
      )}

      <TableCell style={{ padding: "8px 0" }}>
        <Typography>
          {bond.isSoldOut ? (
            "--"
          ) : (
            <BondPrice
              price={bond.price.inBaseToken}
              isInverseBond={isInverseBond}
              symbol={isInverseBond ? baseTokenName : quoteTokenName}
            />
          )}
        </Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        {bond.isSoldOut ? <Typography> "--"</Typography> : <BondDiscount discount={bond.discount} />}
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" flexDirection={"column"}>
          <Typography style={{ lineHeight: "20px" }}>{payoutTokenCapacity(bond, isInverseBond)}</Typography>
          {bond.baseToken.name !== bond.quoteToken.name && (
            <Typography color="textSecondary" style={{ fontSize: "12px", fontWeight: 400, lineHeight: "18px" }}>
              {quoteTokenCapacity(bond)}
            </Typography>
          )}
        </Box>
      </TableCell>
      {!isInverseBond && (
        <TableCell style={{ padding: "8px 0" }}>
          <Typography>{bond.isSoldOut ? "--" : <BondDuration duration={bond.duration} />}</Typography>
        </TableCell>
      )}

      <TableCell style={{ padding: "8px 0" }}>
        <Link
          component={NavLink}
          to={
            isInverseBond
              ? `/bonds/${bond.isV3Bond ? `v3/` : ""}inverse/${bond.id}`
              : `/bonds/${bond.isV3Bond ? `v3/` : ""}${bond.id}`
          }
        >
          <TertiaryButton fullWidth disabled={bond.isSoldOut}>
            {bond.isSoldOut ? "Sold Out" : `Bond for ${baseTokenName}`}
          </TertiaryButton>
        </Link>
      </TableCell>
    </TableRow>
  );
};

const TokenIcons: React.VFC<{ token: Token; explorer?: boolean }> = ({ token, explorer }) => (
  <Box display="flex" alignItems="center">
    <TokenStack tokens={token.icons} />

    <Box display="flex" flexDirection="column" ml="16px">
      <Typography style={{ fontSize: "12px", fontWeight: 600, lineHeight: "18px" }}>{token.name}</Typography>

      <Link
        color="primary"
        target="_blank"
        href={explorer ? `https://etherscan.io/token/${token.addresses[NetworkId.MAINNET]}` : token.purchaseUrl}
      >
        <Box display="flex" alignItems="center">
          <Typography style={{ fontSize: "12px", lineHeight: "18px" }}>
            {explorer ? `Explorer` : `Get Asset`}
          </Typography>

          <Box ml="4px">
            <SvgIcon component={ArrowUp} />
          </Box>
        </Box>
      </Link>
    </Box>
  </Box>
);
