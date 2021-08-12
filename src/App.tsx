import React from "react";
import { InputGroup, Button, Card, FormControl } from "react-bootstrap";
import { checkNFTOwnership } from "./methods/checkNFTOwership";
import { connectMetaMask } from "./methods/connect";
import { signEmail } from "./methods/signVerify";
import { submitForm } from "./methods/apiCalls";

function App() {
  const [account, setAccount] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = React.useState<string>("Not Connected");
  const [hasNFT, setHasNFT] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState<boolean>(false);
  const [signature, setSignature] = React.useState<string>("");

  function checkNetwork(id:number){
    if (id!==1){
      setConnectionStatus("Wrong Network");
    } else {

    setConnectionStatus("Connected");
    }
  }

  async function connect() {
    setBusy(true);
    const {
      networkId,
      accounts,
      web3,
      provider,
    } = await connectMetaMask(
      (accounts: string[]) => {
        setAccount(accounts[0]);
      },
      async (_networkId: number) => {
        checkNetwork(_networkId)
      }
    );
    setProvider(provider);
    checkNetwork(networkId)

    networkId===1&&setHasNFT(
      web3 &&
        (await checkNFTOwnership(
          web3,
          accounts[0]//"0x3e5e1a443feb2e5e7f611c4f2426c275811a46f5"
        ))
        ? true
        : false
    );
    setBusy(false);
  }

  async function associateAndSend() {
    const sig = await signEmail(email, account, provider);
    setSignature(sig);
    try {
      await submitForm(email, account, sig);
    } catch (e) {
      setStatus(e);
    }
    setStatus("Submited successfully");
  }

  return (
    <div className="App">
      <header className="App-header">
        <Card body>
          <Card.Title>
            Step 1: Connect Wallet to Check Moonbeam PolkaPets Ownership
          </Card.Title>
          <Card.Text>
            Moonbeam PolkaPet owners are invited to join the Moonbeam Take
            Flight token event whitelist. Please note Chinese and U.S. citizens
            and residents are not eligible to participate in this token event.
          </Card.Text>
          <Button
            variant="warning"
            block
            size="sm"
            disabled={busy}
            onClick={() => connect()}
          >
            <small>Connect and Check</small>
          </Button>
          <div style={connectionStatus==="Connected"?{color:"green"}:{color:"red"}}>{connectionStatus}</div>
          <div>Account: {account}</div>
          {connectionStatus==="Connected"&&<div style={hasNFT?{color:"green"}:{color:"red"}}>
            {hasNFT ? "Owns a MOONBEAM NFT" : "Doesn't Own a MOONBEAM NFT"}
          </div>}
        </Card>
        {hasNFT ? (
          <Card body>
            <Card.Title>
              Step 2: Register email to join the Moonbeam Take Flight whitelist
            </Card.Title>
            <Card.Text>
              The email address you provide must be the same one you will use to
              register for the Take Flight event. By providing your email, you
              are subscribing to email notifications from the Moonbeam
              Foundation about the event.
            </Card.Text>
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
            <div style={status==="Submited successfully"?{color:"green"}:{}}>Status: {status}</div>
          </Card>
        ) : null}
      </header>
    </div>
  );
}

export default App;
