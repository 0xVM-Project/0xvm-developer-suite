import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { privateKeyToAccount } from "xmv-sdk";
import Log from "xmv-sdk/dist/Log";
import { extendProvider } from "hardhat/config";
import { XVMProvider } from "./XVMProvider";
import { transmuteToPrivateKey } from "./hardhatUtils";

const XMV_MAINNET_CHAIN_ID = 0;
const XMV_MAINNET_TESTNET_ID = 42;

extendProvider(async (provider, config, network) => {

  const xvmNetwork = config.networks[network];

  const chainId = xvmNetwork.chainId ? xvmNetwork.chainId! : Number(await provider.request({ method: "eth_chainId", params: []}) as string);
  
  const isXvmNetwork = isXVMNetwork(chainId);
  
  Log.info(`XVM plugin: extendProvider work is called, select network = ${network}, isXVMNetwork = ${isXvmNetwork}, chainId = ${chainId}, accounts = ${xvmNetwork.accounts}`);

  if (isXvmNetwork) {

    const privateKey = transmuteToPrivateKey(xvmNetwork);
    const { btcAccount } = await privateKeyToAccount(privateKey, getXVMNetwork(chainId));

    return new XVMProvider(provider, btcAccount);
  } else {
    return provider;
  }
});

const isXVMNetwork = (chainId?: number) => {
  return chainId === XMV_MAINNET_CHAIN_ID || chainId === XMV_MAINNET_TESTNET_ID;
}

const getXVMNetwork = (chainId?: number) => {
  if (isXVMNetwork(chainId)) {
    return chainId === XMV_MAINNET_CHAIN_ID ? NetworkType.MAINNET : NetworkType.TESTNET;
  }
  throw new Error(`Unsupported network: ${chainId}`);
}
