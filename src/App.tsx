import React from "react";
import {
  InputGroup,
  Button,
  Card,
  FormControl,
} from "react-bootstrap";
import logo from "./logo.svg";
import { checkNFTOwnership } from "./methods/checkNFTOwership";
// import './App.css';
import { connectMetaMask } from "./methods/connect";
import { signEmail } from "./methods/signVerify";
//@ts-ignore
import GoogleForm from "google-form-send";
import { submitForm } from "./methods/apiCalls";

function App() {
  const [account, setAccount] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [network, setNetwork] = React.useState<string>("Moonbase Alpha");
  const [busy, setBusy] = React.useState<boolean>(false);
  const [isConnected, setConnected] = React.useState<boolean>(false);
  const [hasNFT, setHasNFT] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState<boolean>(false);
  const [signature, setSignature] = React.useState<string>("");
  const form = new GoogleForm(
    "https://docs.google.com/forms/d/e/1FAIpQLScHbQWSCWlHXgdswg5W18Hxa-Y0hwLv2_sGYcT5NF6z-jaj8Q"
  );

  async function connect(toAlpha?: boolean) {
    setBusy(true);
    const {
      networkId,
      isConnected,
      accounts,
      web3,
      provider,
    } = await connectMetaMask(
      (accounts: string[]) => {
        setAccount(accounts[0]);
      },
      async (_networkId: number) => {
        //
      },
      toAlpha
    );
    setProvider(provider);
    // TODO : check network id
    
    setHasNFT(
      web3 &&
        (await checkNFTOwnership(
          web3,
          accounts[0]// "0x3e5e1a443feb2e5e7f611c4f2426c275811a46f5"
        ))
        ? true
        : false
    );
    setConnected(isConnected);
    setBusy(false);
  }
  async function associateAndSend() {
    const sig = await signEmail(email, account, provider);
    console.log("sig",sig)
    setSignature(sig);
    try {
      await submitForm(email,account,sig)
    } catch(e){
      setStatus(e)
    }
    setStatus("Submited successfully")// TODO add green and red status
  }

  return (
    <div className="App">
      <header className="App-header">
        <Card body>
          <Card.Title>
            Step 1: Connect MetaMask and Check NFT Ownership
          </Card.Title>
          <Card.Text>blablabla</Card.Text>
          <Button
            variant="warning"
            block
            size="sm"
            disabled={busy}
            onClick={() => connect()}
          >
            <small>Connect and Check</small>
          </Button>
          <div>{isConnected ? "Connected" : "Not Connected"}</div>
          <div>Account: {account}</div>
          <div>
            {hasNFT ? "Owns a MOONBEAM NFT" : "Doesn't Own a MOONBEAM NFT"}
          </div>
        </Card>
        {hasNFT ? (
          <Card body>
            <Card.Title>
              Step 2: Associate Email Address with Eth Address
            </Card.Title>
            <Card.Text>blablabla</Card.Text>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
              <FormControl
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </InputGroup>
            <Button
              variant="warning"
              block
              size="sm"
              disabled={busy}
              onClick={() => associateAndSend()}
            >
              <small>Sign And Send</small>
            </Button>
            <div>Signature: {signature}</div>
            <div>Status: {status}</div> 
          </Card>
        ) : null}
      </header>
    </div>
  );
}

export default App;
