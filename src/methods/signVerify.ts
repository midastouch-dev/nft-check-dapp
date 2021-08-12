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
  console.log("signing message " + msg);
  const msgHashHex = ethUtil.bufferToHex(Buffer.from(completeWithZeros(msg)));
  console.log("msgHashHex", msgHashHex);
  return await provider.request({
    method: "eth_sign",
    params: [address, msgHashHex],
  });
}
