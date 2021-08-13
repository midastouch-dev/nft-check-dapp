import React from "react";
import { InputGroup, Button, Card, FormControl, Container } from "react-bootstrap";
import { BLOCK_NUMBER, checkNFTOwnership } from "./methods/checkNFTOwership";
import { connectMetaMask } from "./methods/connect";
import { signEmail } from "./methods/signVerify";
import { submitForm } from "./methods/apiCalls";

import mrLogo from "./moonriver-logo.png";
import fdLogo from "./foundation-logo.png";

require("dotenv").config();

function App() {
  const [account, setAccount] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = React.useState<string>(
    "Not Connected"
  );
  const [hasNFT, setHasNFT] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState<boolean>(false);
  const [signature, setSignature] = React.useState<string>("");

  function checkNetwork(id: number) {
    if (id !== 1) {
      setConnectionStatus("Wrong Network");
    } else {
      setConnectionStatus("Connected");
    }
  }

  async function connect() {
    setBusy(true);
    const { networkId, accounts, web3, provider } = await connectMetaMask(
      (accounts: string[]) => {
        setAccount(accounts[0]);
      },
      async (_networkId: number) => {
        checkNetwork(_networkId);
      }
    );
    setProvider(provider);
    checkNetwork(networkId);

    networkId === 1 &&
      setHasNFT(
        web3 &&
          (await checkNFTOwnership(
            web3,
            accounts[0] //"0x3e5e1a443feb2e5e7f611c4f2426c275811a46f5"
          ))
          ? true
          : false
      );
    setBusy(false);
  }

  async function associateAndSend() {
    setBusy(true);
    setStatus("Signing...");
    const sig = await signEmail(email, account, provider);
    setSignature(sig);
    setStatus("Sending...");
    try {
      const resp = await submitForm(email, account, sig);
      console.log(resp);
      //@ts-ignore
      if (resp.message) {
        //@ts-ignore
        setStatus(resp.message);
      } else {
        setStatus("Submited successfully");
      }
    } catch (e) {
      setStatus(e.toString());
    }
    setBusy(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <nav
          className="navbar is-dark"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a className="navbar-item">
              <img src={mrLogo} alt="Moonriver" style={{maxHeight: 50}}/>
            </a>
          </div>
          <div className="navbar-end">
            <a
              className="navbar-item"
              href="https://moonbeam.foundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={fdLogo} alt="Moonriver Foundation" />
            </a>
          </div>
        </nav>

        <Container>
          <h1 className="title" style={{marginTop: 20}}>
            Moonbeam Token Event Polkapet Whitelist
          </h1>
          <Card body>
            <Card.Title>
              Step 1: Connect MetaMask to Check Moonbeam PolkaPets Ownership
            </Card.Title>
            <Card.Text>
              Moonbeam PolkaPet owners are invited to join the Moonbeam Take Flight token event whitelist.<br />
              Please note Chinese and U.S. citizens and residents are <u>not eligible</u> to participate in this token event.
              For additional information on eligibility please see <a href="https://moonbeam.foundation/take-flight/#eligibility" target="_blank" rel="noopener">Take Flight eligibility</a>.
            </Card.Text>
            <Card.Text>
              NB: You need to own the NFT by block: {BLOCK_NUMBER}
            </Card.Text>

            {connectionStatus === "Connected" && 
              <div>Account: {account} - <span style={hasNFT ? { color: "green" } : { color: "red" }}>
                  {hasNFT ? "Owns a MOONBEAM NFT" : "No MOONBEAM NFT has been detected, you can’t continue"}
                </span>
              </div>
            }

            {connectionStatus !== "Connected" && 
              <Button
                variant="info"
                block
                size="sm"
                disabled={busy}
                onClick={() => connect()}
              >
                <small>Connect and Check</small>
              </Button>
            }
            <div
              style={
                connectionStatus === "Connected"
                  ? { color: "green", paddingTop:"1em" }
                  : { color: "red", paddingTop:"1em"  }
              }
            >
              Connection Status: {connectionStatus}
            </div>
          </Card>
          {hasNFT ? (
            <Card body>
              <Card.Title>
                Step 2: Register email to join the Moonbeam Take Flight
                whitelist
              </Card.Title>
              <Card.Text>
                The email address you provide must be the same one you will use
                to register for the Take Flight event. By providing your email,
                you are subscribing to email notifications from the Moonbeam Foundation
                and you are agreeing to the terms and conditions of
                the Moonbeam Foundation’s Privacy Policy outlined <a href="https://moonbeam.foundation/privacy-policy/" target="_blank" rel="noopener">here</a>. 
              </Card.Text>

              { signature.length === 0 ?
                <>
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
                    variant="info"
                    block
                    size="sm"
                    disabled={busy}
                    onClick={() => associateAndSend()}
                  >
                    <small>Sign And Send</small>
                  </Button>
                </> : <>
                  <div>Email: {email}</div>
                  <div>Signature: {signature}</div>
                  <div
                    style={
                      status === "Submited successfully" ? { color: "green" } : { color: "orange" }
                    }
                  >
                    Status: {status}
                  </div>
                </>
              }
              { status === "Submited successfully" &&
                <Card.Title style={{marginTop: 8}}>
                  You have been successfully registered in our whitelist!
                </Card.Title>
              }
            </Card>
          ) : null}
        </Container>

      </header>
    </div>
  );
}

export default App;
