import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
type Address = string;

export async function connectMetaMask(
  onAccountsChanged: (accounts: Address[]) => void,
  onNetworkChanged: (networkId: number) => void
): Promise<{
  isConnected: boolean;
  networkId: number;
  accounts: string[];
  web3: Web3 | null;
  provider: any;
}> {
  let isConnected: boolean = false;
  let web3: Web3 | null = null;
  let networkId: number = 0;
  let provider: any;
  let accountsRead: string[] = ["0x0"];
  if ((window as { [key: string]: any }).ethereum) {
    provider = await detectEthereumProvider({ mustBeMetaMask: true });
    console.log("PROVIDER", provider);
    if (provider && provider.isMetaMask) {
      try {
        // initiate web3
        web3 = new Web3(provider);

        // Enable MetaMask accounts
        accountsRead = await provider.request({
          method: "eth_requestAccounts",
        });

        if (onAccountsChanged) {
          onAccountsChanged(accountsRead);
          provider.on("accountsChanged", async (accounts: string[]) => {
            if (accounts.length > 0) {
              const accountsReadAgain = await provider.request({
                method: "eth_accounts",
              });
              console.log("accountsChanged", accountsReadAgain);
              onAccountsChanged(accountsReadAgain);
            } else {
              window.location.reload();
            }
          });

          provider.on("chainChanged", async (chainId: string) => {
            onNetworkChanged(Number(chainId));
            await connectMetaMask(onAccountsChanged, onNetworkChanged);
          });
        }
        isConnected = true;
        networkId = await web3.eth.net.getId();
      } catch (e) {
        if (e.code !== 4001) {
          throw new Error(e.message);
        }
      }
    } else {
      throw new Error("Other ethereum wallet did not support.");
    }
  }
  return { isConnected, networkId, accounts: accountsRead, web3, provider };
}
