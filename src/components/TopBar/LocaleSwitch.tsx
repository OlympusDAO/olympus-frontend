import { useState, useEffect, MouseEvent } from "react";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReferenceObject } from "popper.js";
import FlagIcon from "../../helpers/flagicon.js";
import { i18n, localeDefinitions } from "../../locales";
import "./localesmenu.scss";

function LocaleSwitcher() {
  const [anchorEl, setAnchorEl] = useState<ReferenceObject | null>(null);
  const id = "locales-popper";
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const selectLocale = (locale: string) => {
    i18n.activate(locale);
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
        title="Locale"
        aria-describedby={id}
      >
        <FlagIcon code={localeDefinitions[i18n.locale].flag} />
        <span>&nbsp;</span>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="locales-menu" elevation={1}>
                <Box component="div">
                  {Object.values(localeDefinitions).map(definition => {
                    return (
                      <Button size="large" variant="contained" fullWidth onClick={e => selectLocale(definition.locale)}>
                        <Typography align="left">
                          &nbsp;
                          <FlagIcon code={definition.flag} />
                        </Typography>
                      </Button>
                    );
                  })}
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
