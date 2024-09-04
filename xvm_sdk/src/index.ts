import { AddressType } from "@unisat/wallet-sdk";
import { ECPair, bitcoin } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { NetworkType, toPsbtNetwork } from "@unisat/wallet-sdk/lib/network";
import { LocalWallet } from "@unisat/wallet-sdk/lib/wallet";
import { ethers } from "ethers";
import { Account, Hex } from "viem";
import { privateKeyToAccount as viemPrivateKeyToAccount } from "viem/accounts";
import { XVMClient } from "./request/XVMRequest";
import { text } from "stream/consumers";

export async function privateKeyToAccount(
	generalPrivateKey: string,
	network: NetworkType
) {
	return privateKeysToAccount(generalPrivateKey, generalPrivateKey, network);
}
/**
 * Import wallet and bind address
 * @param privateKey private key
 * @returns Object containing XVM address and binding status.
 * isNewBinding is true if it's the first time binding
 */
export async function privateKeysToAccount(
	ethPrivateKey: string,
	btcPrivateKey: string,
	network: NetworkType
): Promise<UltraAccount> {
	const ethWallet = new ethers.Wallet(ethPrivateKey);
	const xvmAddress = ethWallet.address;
	const xvmClient = new XVMClient(network);

	const pair = ECPair.fromPrivateKey(
		Buffer.from(
			btcPrivateKey.startsWith("0x") ? btcPrivateKey.slice(2) : btcPrivateKey,
			"hex"
		),
		{ network: toPsbtNetwork(network) }
	);
	const btcWallet = new LocalWallet(pair.toWIF(), AddressType.P2TR, network);
	const btcAddress = btcWallet.address;

	const message = `\x19Ethereum Signed Message:\n32${xvmAddress}:${btcAddress}`;
	const sig = await ethWallet.signMessage(message);

	const bindingStatus = await xvmClient.addressMapping(
		xvmAddress,
		btcAddress,
		sig
	);

	// bind fail. throw error
	if (bindingStatus.code !== 0 && bindingStatus.code !== 9004) {
		throw new Error(
			`address mapping failed: code = ${bindingStatus.code}, message = ${bindingStatus?.errorMessage}`
		);
	}

	return {
		xvmAccount: viemPrivateKeyToAccount(ethWallet.privateKey as Hex),
		xvmAddress: bindingStatus.data.xvmAddress ?? xvmAddress,
		btcAddress: bindingStatus.data.btcAddress ?? btcAddress,
		isNewBinding: bindingStatus.code !== 9004,
		btcAccount: btcWallet,
	};
}

export type BtcAccount = LocalWallet;

export type UltraAccount = {
	xvmAccount: Account,
	xvmAddress: string,
	btcAddress: string,
	isNewBinding: boolean,
	btcAccount: BtcAccount,
}
