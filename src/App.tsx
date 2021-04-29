import React from 'react';
import { Container, Form, InputGroup, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import { connectMetaMask } from './connect';

function App() {
  const [account, setAccount] = React.useState<string>('');
  const [balance, setBalance] = React.useState<string>('');
  const [network, setNetwork] = React.useState<string>('Moonbase Alpha');
  const [busy, setBusy] = React.useState<boolean>(false);
  const [isConnected, setConnected] = React.useState<boolean>(false);

  async function connect(toAlpha?: boolean) {
    setBusy(true);
    const { networkId, isConnected, accounts } = await connectMetaMask(
      (accounts: string[]) => {
        setAccount(accounts[0]);
        // updateBalance(accounts[0]);
      },
      async (_networkId: number) => {
        // await updateBalance(account);
        // setNetwork(networkName(_networkId));
      },
      toAlpha
    );
    // if (accounts.length>0) {setAccount(account[0])}
    setConnected(isConnected)
    // setNetwork(networkName(networkId));
    setBusy(false);
  }
  return (
    <div className="App">
      <header className="App-header">
        <Button variant="warning" block size="sm" disabled={busy} onClick={() => connect()}>
          <small>Connect</small>
        </Button>
        <div>{isConnected?"Connected":"Not Connected"}</div>
        <div>Account: {account}</div>
      </header>
    </div>
  );
}

export default App;
