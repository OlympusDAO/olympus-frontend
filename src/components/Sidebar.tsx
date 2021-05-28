import React, { useState, useCallback, } from 'react';

// displays a page header

type Props = {
  isExpanded: boolean;
};

function Sidebar({ isExpanded }: Props) {

  const setMax = useCallback(() => {
    return null
  }, []);

  const seekApproval = useCallback(() => {
    return null
  }, []);

  const disconnectWallet = useCallback(() => {
    return null
  }, []);

  return (
    <div
      className={`${isExpanded ? 'show' : '' } col-lg-2 col-2 d-md-block sidebar collapse`}
      id="sidebarContent"
    >
      <div class="dapp-sidebar d-flex flex-column">
        <div class="dapp-menu-top">
          <div class="branding-header">
            <img class="branding-header-icon" src="~/@/assets/logo.svg" alt="" />
          </div>

          <div class="wallet-menu">
            <a
              class="disconnect-button button-primary button"
              onClick={disconnectWallet}
              >Disconnect</a
            >
            <a class="dapp-sidebar-button-connected button button-info">
              <span class="login-bullet mr-2 ml-n2" />

            </a>
            <a
              v-else
              class="dapp-sidebar-button-connect button button-primary"
              onClick="modalLoginOpen = true"
            >
              Connect wallet
            </a>
          </div>
        </div>

      </div>

    </div>

  );
}

export default Sidebar;
