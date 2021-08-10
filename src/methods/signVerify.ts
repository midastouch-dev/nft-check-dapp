import Web3 from 'web3';
import { AbiItem, hexToNumber } from 'web3-utils';
import detectEthereumProvider from '@metamask/detect-provider';
import { signatureVerify } from '@polkadot/util-crypto'
import { sign } from 'crypto';
const ethUtil = require('ethereumjs-util')

export const ALITH_PRIVKEY = "0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133";
const testMsg = "hello world but a lil bit longer"

type Address = string;

export function completeWithZeros(input:string):string{
    if (input.length>31){
        return input
    } else {
        return completeWithZeros(input+"0")
    }
}

export async function signVerify(
	provider:any,
    account:string
) {
	
    const msgHashHex =ethUtil.bufferToHex(Buffer.from(testMsg)) //ethUtil.bufferToHex(ethUtil.keccak(Buffer.from(testMsg)))
    const signedMsg = await provider.request({ method: 'eth_sign', params: [account, msgHashHex] });
    console.log("SIGNED", signedMsg)
    
    console.log('verify', signatureVerify(testMsg, signedMsg, account))

    const r = ethUtil.toBuffer(signedMsg.slice(0, 66))
    const s = ethUtil.toBuffer(`0x${signedMsg.slice(66, 130)}`)
    const v = ethUtil.bufferToInt(ethUtil.toBuffer(`0x${signedMsg.slice(130, 132)}`))
    const m = ethUtil.toBuffer(msgHashHex)
    const pub = ethUtil.ecrecover(m, v, r, s)
    const adr = `0x${ethUtil.pubToAddress(pub).toString('hex')}`
    console.log("ADDRESS", adr)
}

export async function signEmail(msg:string,address:string,provider:any):Promise<string>{
    console.log("signing message "+msg)
    const msgHashHex =ethUtil.bufferToHex(Buffer.from(completeWithZeros(msg))) //ethUtil.bufferToHex(ethUtil.keccak(Buffer.from(testMsg)))
    console.log("msgHashHex",msgHashHex)
    return await provider.request({ method: 'eth_sign', params: [address, msgHashHex] });
}