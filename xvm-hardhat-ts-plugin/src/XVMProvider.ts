import { ProviderWrapper } from "hardhat/plugins";
import { EIP1193Provider, RequestArguments } from "hardhat/types";
import { BtcAccount } from "cyf_developer_sdk_test";
import { makeInscribe } from "cyf_developer_sdk_test/dist/inscribe";
import Log from "cyf_developer_sdk_test/dist/Log";
import { Transaction } from "ethers";

export class XVMProvider extends ProviderWrapper {

	constructor(
		protected readonly _wrappedProvider: EIP1193Provider,
		protected readonly xvmAccount: BtcAccount
	) {
		super(_wrappedProvider);
	}

	request(args: RequestArguments): Promise<unknown> {

		if (args.method === "eth_sendRawTransaction") {

			Log.info(
				"XVMProvider eth_sendRawTransaction is captured, param = ",
				args.params
			);
			let txHex = (args.params as string[])[0]

			// generate tx id
			let txHash = Transaction.from(txHex).hash ?? "";

			return makeInscribe(this.xvmAccount, txHash)
				.then(res => {
					return txHash;
				})
		}

		return this._wrappedProvider.request(args);
	}
}
