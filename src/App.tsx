import React from 'react';
import { Container, Form, InputGroup, Button, Card, FormControl } from 'react-bootstrap';
import logo from './logo.svg';
import { checkNFTOwnership } from './methods/checkNFTOwership';
// import './App.css';
import { connectMetaMask } from './methods/connect';
import { signEmail } from './methods/signVerify';

function App() {
  const [account, setAccount] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [network, setNetwork] = React.useState<string>('Moonbase Alpha');
  const [busy, setBusy] = React.useState<boolean>(false);
  const [isConnected, setConnected] = React.useState<boolean>(false);
  const [hasNFT, setHasNFT] = React.useState<boolean>(false);
  const [provider, setProvider] = React.useState<boolean>(false);
  const [signature, setSignature] = React.useState<string>("");

  async function connect(toAlpha?: boolean) {
    setBusy(true);
    const { networkId, isConnected, accounts, web3, provider } = await connectMetaMask(
      (accounts: string[]) => {
        setAccount(accounts[0]);
      },
      async (_networkId: number) => {
        // 
      },
      toAlpha
    );
    setProvider(provider)
    // TODO : check network id
    console.log('HASNFT',web3&&await checkNFTOwnership(web3,accounts[0]))
    console.log('HASNFT (yes)',web3&&await checkNFTOwnership(web3,"0x3e5e1a443feb2e5e7f611c4f2426c275811a46f5"))
    setHasNFT((web3&&await checkNFTOwnership(web3,"0x3e5e1a443feb2e5e7f611c4f2426c275811a46f5"))?true:false)
    // setHasNFT((web3&&await checkNFTOwnership(web3,accounts[0]))?true:false)
    setConnected(isConnected)
    setBusy(false);
  }
  async function associate(){
    // console.log(await signEmail(email,account,provider))
    const sig=await signEmail(email,account,provider)
    // console.log("sig",sig)
    setSignature(sig)
  }
  return (
    <div className="App">
      <header className="App-header">
      <Card body>
        <Card.Title>Step 1: Connect MetaMask and Check NFT Ownership</Card.Title>
        <Card.Text>blablabla</Card.Text>
        <Button variant="warning" block size="sm" disabled={busy} onClick={() => connect()}>
          <small>Connect and Check</small>
        </Button>
        <div>{isConnected?"Connected":"Not Connected"}</div>
        <div>Account: {account}</div>
        <div>{hasNFT?"Owns a MOONBEAM NFT":"Doesn't Own a MOONBEAM NFT"}</div>
      </Card>
      {hasNFT?<Card body>
        <Card.Title>Step 2: Associate Email Address with Eth Address</Card.Title>
        <Card.Text>blablabla</Card.Text>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
          <FormControl
            placeholder="email@domain.com"
            // aria-label="Email"
            // aria-describedby="basic-addon1"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value)
            }}
          />
        </InputGroup>
        <Button variant="warning" block size="sm" disabled={busy} onClick={() => associate()}>
          <small>Sign</small>
        </Button>
        <div>Signature: {signature}</div>
      </Card>:null}
      </header>
    </div>
  );
}

export default App;
