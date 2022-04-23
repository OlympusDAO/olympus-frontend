import "src/helpers/index";

import { i18n } from "@lingui/core";
import { t, Trans } from "@lingui/macro";
import { I18nProvider } from "@lingui/react";
import { LocaleSwitcher } from "@olympusdao/component-library";
import { render } from "@testing-library/react";
import React from "react";

import { locales, selectLocale } from "../../../locales";
import { act, fireEvent, screen } from "../../../testUtils";

describe("<LocaleSwitcher/>", () => {
  it("should change locale", async () => {
    await act(async () => {
      render(
        <I18nProvider i18n={i18n}>
          <div data-testid="root" role="button">
            <LocaleSwitcher
              initialLocale={i18n.locale}
              locales={locales}
              onLocaleChange={selectLocale}
              label={t`Change locale`}
            />
          </div>
          <Trans>Change locale</Trans>
        </I18nProvider>,
      );
    });
    // Click on the language menu button
    await act(async () => {
      const menu_button = await screen.getByTitle("Change locale");
      fireEvent.click(menu_button);
    });
    // Click on the French icon
    await act(async () => {
      const fr_button = await screen.getByTitle("Change locale fr");
      fireEvent.click(fr_button);
    });
    // Check that the text was translated in French
    await screen.getByText("Changer de langue");
  });
});
