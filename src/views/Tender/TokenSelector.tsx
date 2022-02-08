import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, SvgIcon } from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";
import { FC } from "react";

interface TokenSelectorProps {
  depositToken: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tokens: { balance: number; label: string; value: number; allowance: number }[];
}

export const TokenSelector: FC<TokenSelectorProps> = ({ depositToken, onChange, tokens }) => (
  <FormControl component="fieldset">
    <FormLabel component="legend">Deposit Token</FormLabel>
    <RadioGroup name="tokenGroup" value={depositToken} onChange={onChange} row>
      {tokens.map((token, index) => {
        if (token.balance > 0) {
          return (
            <FormControlLabel
              value={index}
              control={
                <Radio
                  icon={<SvgIcon component={RadioButtonUnchecked} viewBox="0 0 24 24" />}
                  checkedIcon={<SvgIcon component={RadioButtonChecked} viewBox="0 0 24 24" />}
                  disableRipple={true}
                  color="primary"
                />
              }
              label={token.label}
              key={index}
            />
          );
        }
      })}
    </RadioGroup>
  </FormControl>
);
