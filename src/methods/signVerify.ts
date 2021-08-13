import { keccak256 } from "ethereumjs-util";

const ethUtil = require("ethereumjs-util");

export function completeWithZeros(input: string): string {
  if (input.length > 31) {
    return input;
  } else {
    return completeWithZeros(input + "0");
  }
}

export async function signEmail(
  msg: string,
  address: string,
  provider: any
): Promise<string> {
  return await provider.request({
    method: "personal_sign",
    params: [msg, address],
  });
}

function verify(signedMsg: string, msg: string, address: string) {
  if (signedMsg.substring(0, 2) !== "0x") {
    return false;
  }
  const msgHashHex = ethUtil.bufferToHex(Buffer.from(completeWithZeros(msg)));
  console.log("msgHashHex", msgHashHex);

  try {
    const r = ethUtil.toBuffer(signedMsg.slice(0, 66));
    const s = ethUtil.toBuffer(`0x${signedMsg.slice(66, 130)}`);
    const v = ethUtil.bufferToInt(
      ethUtil.toBuffer(`0x${signedMsg.slice(130, 132)}`)
    );
    const m = ethUtil.toBuffer(
      keccak256(
        Buffer.from("\x19Ethereum Signed Message:\n" + msg.length + msg)
      )
    );
    const pub = ethUtil.ecrecover(m, v, r, s);
    const adr = `0x${ethUtil.pubToAddress(pub).toString("hex")}`;
    console.log("ADDRESS", adr, address);
    return adr === address;
  } catch (e) {
    console.log(e);
    return false;
  }
}
