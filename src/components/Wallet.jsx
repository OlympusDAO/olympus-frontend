import { KeyOutlined, QrcodeOutlined, SendOutlined, WalletOutlined } from "@ant-design/icons";
import { parseEther } from "@ethersproject/units";
import { Button, Modal, Spin, Tooltip, Typography } from "antd";
import { useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import QR from "qrcode.react";
import React, { useState } from "react";
import { Transactor } from "../helpers";
import Address from "./Address";
import AddressInput from "./AddressInput";
import Balance from "./Balance";
import EtherInput from "./EtherInput";

const { Text, Paragraph } = Typography;

/*
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <Wallet
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
*/

export default function Wallet(props) {
  const signerAddress = useUserAddress(props.provider);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  // const [pk, setPK] = useState();

  const providerSend = props.provider ? (
    <Tooltip title="Wallet">
      <WalletOutlined
        onClick={() => {
          setOpen(!open);
        }}
        rotate={-90}
        style={{
          padding: 7,
          color: props.color ? props.color : "",
          cursor: "pointer",
          fontSize: 28,
          verticalAlign: "middle",
        }}
      />
    </Tooltip>
  ) : (
    ""
  );

  let display;
  let receiveButton;
  let privateKeyButton;
  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    receiveButton = (
      <Button
        key="hide"
        onClick={() => {
          setQr("");
        }}
      >
        <QrcodeOutlined /> Hide
      </Button>
    );
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="to address"
            address={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <span>
      {providerSend}

      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address address={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: "right", paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props.provider} />
            </div>
          </div>
        }
        onOk={() => {
          setQr();

          setOpen(!open);
        }}
        onCancel={() => {
          setQr();

          setOpen(!open);
        }}
        footer={[
          privateKeyButton,
          receiveButton,
          <Button
            key="submit"
            type="primary"
            disabled={!amount || !toAddress || qr}
            loading={false}
            onClick={() => {
              const tx = Transactor(props.provider);

              let value;
              try {
                value = parseEther("" + amount);
              } catch (e) {
                // failed to parseEther, try something else
                value = parseEther("" + parseFloat(amount).toFixed(8));
              }

              tx({
                to: toAddress,
                value,
              });
              setOpen(!open);
              setQr();
            }}
          >
            <SendOutlined /> Send
          </Button>,
        ]}
      >
        {display}
      </Modal>
    </span>
  );
}
