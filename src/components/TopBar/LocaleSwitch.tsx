import { t } from "@lingui/macro";
import { i18n } from "@lingui/core";
import { ReferenceObject } from "popper.js";
import { useState, MouseEvent } from "react";
import { Popper, Button, Paper, Typography, Box, Fade } from "@material-ui/core";

import FlagIcon from "../../helpers/flagicon.js";
import { locales, selectLocale } from "../../locales";

import "./localesmenu.scss";

function getLocaleFlag(locale: string) {
  return locales[locale].flag;
}

function LocaleSwitcher() {
  const id = "locales-popper";
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <Box
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="locales-menu-button-hover"
    >
      <Button
        className="toggle-button"
        size="large"
        variant="contained"
        color="secondary"
        title={t`Change locale`}
        aria-describedby={id}
      >
        <FlagIcon code={getLocaleFlag(i18n.locale)} />
        <span>&nbsp;</span>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="locales-menu" elevation={1}>
                <Box component="div">
                  {Object.keys(locales).map((locale, key) => (
                    <Button key={key} size="large" variant="contained" fullWidth onClick={() => selectLocale(locale)}>
                      <Typography align="left">
                        &nbsp;
                        <FlagIcon code={getLocaleFlag(locale)} />
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Box>
  );
}

export default LocaleSwitcher;
