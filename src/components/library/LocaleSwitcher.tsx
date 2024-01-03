import { Box, Button, Popper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, useState } from "react";
import Icon from "src/components/library/Icon";
import Paper from "src/components/library/Paper";
const PREFIX = "LocaleSwitcher";

const classes = {
  localesMenu: `${PREFIX}-localesMenu`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${classes.localesMenu}`]: {
    padding: "6px 6px",
    display: "flex",
    flexDirection: "column",
    maxWidth: "80px",
    "& button": {
      backgroundColor: "transparent",
      boxShadow: "none",
      display: "block",
      textAlign: "center",
      width: "100%",
      "&:hover": {
        boxShadow: "none",
        backgroundColor: theme.colors.gray[10],
      },
    },
    "& .MuiButton-label": {
      paddingTop: "5px",
    },
  },
}));

interface ILocale {
  flag: "kr" | "gb" | "fr" | "tr" | "cn" | "ae" | "es" | "vn" | "de" | "pl" | "ru";
  plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
  direction: "inherit" | "rtl";
}

interface ILocales {
  [locale: string]: ILocale;
}

export interface OHMLocaleSwitcherProps {
  initialLocale: string;
  locales: ILocales;
  onLocaleChange: (locale: string) => void;
  label?: string;
}

const LocaleSwitcher: FC<OHMLocaleSwitcherProps> = ({
  initialLocale,
  locales,
  onLocaleChange,
  label = "Change locale",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [locale, setLocale] = useState<string>(initialLocale);

  const selectLocale = (locale: string) => {
    setLocale(locale);
    setAnchorEl(null);
    onLocaleChange(locale);
  };

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  return (
    <>
      <Button
        sx={{ minWidth: "30px", padding: "15px", maxHeight: "40px" }}
        size="large"
        variant="contained"
        color="secondary"
        onClick={handleClick}
        title={label}
        aria-describedby={"locales-popper"}
      >
        <Icon name={`flag-${locales[locale].flag}`} sx={{ fontSize: "20px" }} />
      </Button>
      <Popper
        id={"locales-popper"}
        open={Boolean(anchorEl)}
        placement="bottom"
        anchorEl={anchorEl}
        sx={{ zIndex: 1000000, marginTop: "10px !important", borderRadius: "10px" }}
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        slotProps={undefined}
        slots={undefined}
      >
        <StyledPaper className={classes.localesMenu} enableBackground>
          <Box component="div">
            {Object.keys(locales).map((locale: string) => (
              <Button
                title={`${label} ${locales[locale].flag}`}
                key={locale}
                size="large"
                variant="contained"
                fullWidth
                onClick={() => selectLocale(locale)}
              >
                <Icon name={`flag-${locales[locale].flag}`} sx={{ fontSize: "20px" }} />
              </Button>
            ))}
          </Box>
        </StyledPaper>
      </Popper>
    </>
  );
};

export default LocaleSwitcher;
