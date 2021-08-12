import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { NFT_ABI } from "./NFT_ABI";

const POLKAPET_CONTRACT_ADDRESS = "0x8cb813bf27dc744fc5fb6ba7515504de45d39e08";

export async function checkNFTOwnership(web3: Web3, account: string) {
  const contract = new web3.eth.Contract(
    NFT_ABI as AbiItem[],
    POLKAPET_CONTRACT_ADDRESS
  );
  console.log("contract", contract);
  const balanceMoonbeam = await new Promise<number>((res) => {
    contract.methods
      .balanceOf(account, 1)
      .call()
      .then(function (result: any) {
        res(result);
      });
  });
  const balanceValentines = await new Promise<number>((res) => {
    contract.methods
      .balanceOf(account, 8)
      .call()
      .then(function (result: any) {
        res(result);
      });
  });
  return balanceMoonbeam > 0 || balanceValentines > 0;
}
