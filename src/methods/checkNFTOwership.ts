import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { NFT_ABI } from "./NFT_ABI";

const POLKAPET_CONTRACT_ADDRESS = "0x8cb813bf27dc744fc5fb6ba7515504de45d39e08";
const BLOCK_NUMBER = "13016689";
export async function checkNFTOwnership(web3: Web3, account: string) {
  const contract = new web3.eth.Contract(
    NFT_ABI as AbiItem[],
    POLKAPET_CONTRACT_ADDRESS
  );
  const balanceMoonbeam = await new Promise<number>((res) => {
    contract.methods
      .balanceOf(account, 1)
      .call({}, BLOCK_NUMBER)
      .then(function (result: any) {
        res(result);
      });
  });
  const balanceValentines = await new Promise<number>((res) => {
    contract.methods
      .balanceOf(account, 8)
      .call({}, BLOCK_NUMBER)
      .then(function (result: any) {
        res(result);
      });
  });
  return balanceMoonbeam > 0 || balanceValentines > 0;
}
