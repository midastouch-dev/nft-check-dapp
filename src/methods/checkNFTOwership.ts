import Web3 from 'web3';
import { AbiItem, hexToNumber } from 'web3-utils';
import detectEthereumProvider from '@metamask/detect-provider';
import { signatureVerify } from '@polkadot/util-crypto'
import { sign } from 'crypto';
import { NFT_ABI } from './NFT_ABI';
const ethUtil = require('ethereumjs-util')

export const ALITH_PRIVKEY = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const testMsg = "hello world but a lil bit longer"
const POLKAPET_CONTRACT_ADDRESS="0x8cb813bf27dc744fc5fb6ba7515504de45d39e08"

type Address = string;
export async function checkNFTOwnership(
	web3:Web3,
    account:string
) {
    const contract = new web3.eth.Contract(NFT_ABI as AbiItem[], POLKAPET_CONTRACT_ADDRESS);
    console.log("contract",contract)
    const balanceMoonbeam= await new Promise<number>((res)=>{
        contract.methods.balanceOf(account,1).call().then(function(result:any){
            // console.log("RESULT",result)
            res(result)
        });
    }) 
    const balanceValentines= await new Promise<number>((res)=>{
        contract.methods.balanceOf(account,8).call().then(function(result:any){
            // console.log("RESULT",result)
            res(result)
        });
    }) 
    // console.log("balance",Number(balance))
    return (balanceMoonbeam>0||balanceValentines>0)
}