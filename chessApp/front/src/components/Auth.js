import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, useModal, Modal, Text } from "@nextui-org/react";
import { FaUser } from 'react-icons/fa';
import { useWeb3React } from "@web3-react/core";
import { networkParams } from "../ether/networks";
import { connectors } from "../ether/connectors";
import { toHex, truncateAddress } from "../ether/utils";
import { useState } from "react";

export default () => {
  const { setVisible, bindings } = useModal();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
  } = useWeb3React();

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature]
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  return (
    <div>
      <div>
      {active ? (
        <Button shadow icon={<FaUser/>} flat color="primary" auto onClick={() => disconnect()}>
          {account}
        </Button>
      ) : (
        <Button shadow icon={<FaUser/>} flat color="primary" auto onClick={() => setVisible(true)}>
          Connect to a wallet
        </Button>
      )}
      </div>
      
      
      <Modal 
        scroll 
        width="600px" 
        aria-labelledby="modal-title"   
        aria-describedby="modal-description" 
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Select Wallet
          </Text>
        </Modal.Header>
        <Modal.Body>
        <Button
              variant="outline"
              onClick={() => {
                activate(connectors.coinbaseWallet);
                setProvider("coinbaseWallet");
              }}
              w="100%"
            >
                <Text>Coinbase Wallet</Text>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                activate(connectors.walletConnect);
                setProvider("walletConnect");
              }}
              w="100%"
            >
                <Text>Wallet Connect</Text>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                activate(connectors.injected);
                setProvider("injected");
              }}
              w="100%"
            >
                <Text>Metamask</Text>
            </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button auto onClick={() => setVisible(false)}>
            Agree
          </Button>
        </Modal.Footer>
    </Modal>
    </div>
    
    
    
  );
}