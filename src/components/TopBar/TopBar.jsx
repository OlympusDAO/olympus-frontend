import React from 'react';
import { shorten } from '../../helpers';
import ThemeSwitcher from "../ThemeSwitch/ThemeSwitch";
import { Flex } from "rimble-ui";
import { Button } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./topbar.scss";

function TopBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal, address, theme, toggleTheme}) {
	const isVerySmallScreen = useMediaQuery("(max-width: 649px)");
	const isUltraSmallScreen = useMediaQuery("(max-width: 495px)");

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        	<Button 
						type="button" 
						variant="contained"
						color="primary"
						className={`btn top-bar-button btn-overwrite-primer m-2`} 
						onClick={logoutOfWeb3Modal} 
						key={1}>
						Disconnect
				</Button>,
      );
    } else {
      modalButtons.push(
        <Button variant="contained" color="secondary" type="button" className={`btn top-bar-button btn-overwrite-primer m-2`} onClick={loadWeb3Modal} key={2}>Connect Wallet</Button>,
      );
    }
  }

  return (
    <div className={`dapp-topbar`}>
			<Flex className="dapp-topbar-items">		
				{!(address && isUltraSmallScreen) &&  
						<ThemeSwitcher 
							theme={theme}
							toggleTheme={toggleTheme} 
						/>
				}
				
				{!isVerySmallScreen && 
					<Button
						id="get-ohm"
						className="get-ohm-button m-2 top-bar-button"
						variant="contained"
						color="secondary"
						title="Get OHM"
					>		
						<a href="https://app.sushi.com/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x383518188c0c6d7730d91b2c03a03c837814a899" target="_blank">
							Get OHM
						</a>
					</Button>
				}
				
				<div className="wallet-menu" id="wallet-menu">
					{modalButtons}
					{address && <button type="button" className={`btn top-bar-button btn-overwrite-primer m-2`}>
						<a href={`https://etherscan.io/address/${address}`} target="_blank" className="ml-2">
							{shorten(address)}
						</a>
					</button>
					}
				</div>
			</Flex>
    </div>
  );
}

export default TopBar;
