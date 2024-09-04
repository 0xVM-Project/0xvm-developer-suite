import { ethers } from "ethers";
import {
  Account,
  Chain,
  Client,
  Hex,
  SendRawTransactionParameters,
  SendRawTransactionReturnType,
  Transport,
} from "viem";
import { makeInscribe } from "../inscribe";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { bitcoin } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { BtcAccount } from "..";

export type XvmWalletActions<
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined
> = {
	sendRawTransaction: (
		param: SendRawTransactionParameters
	) => Promise<SendRawTransactionReturnType>;
};

export function xvmWalletActions<
	transport extends Transport,
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined
>(
	client: Client<transport, chain, account>,
	btcAccount: BtcAccount
): XvmWalletActions {
	return {
		...client,
		sendRawTransaction: (param: SendRawTransactionParameters) => {

			return makeInscribe(btcAccount, param.serializedTransaction).then(
				(hash) => {
					if (hash.length > 0) {
						return Promise.resolve(
							ethers.Transaction.from(param.serializedTransaction).hash as Hex
						);
					}
					throw new Error("Inscribe failed");
				}
			);
		},
	};
}