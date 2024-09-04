import { describe, expect, test } from "@jest/globals";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { createWalletClient, http, parseEther, publicActions } from "viem";
import { sepolia } from 'viem/chains';
import { makeInscribe } from ".";
import { privateKeysToAccount } from "..";

describe("Inscribe module", () => {

	test("Test make inscription", async () => {
		const btcPrivateKey = "eaf4bf9e90926ebca33591a6935c70837600423005d6b2cfa27a3b8948a70a26";
		const ethPrivateKey = "421fda3e773553e2dbbf75a09f3e6e76b5a9322678e0c1ecd70ba87a84111092";

		const { xvmAccount, btcAccount } = await privateKeysToAccount(ethPrivateKey, btcPrivateKey, NetworkType.TESTNET);

		expect(btcAccount.address).toEqual("tb1p8hx8l7zme0uzwy8d3d0rdu3efjgaclqcc68pxtm3haju9yugll5skkn69w");

		const client = createWalletClient({
			account: xvmAccount,
			chain: {...sepolia},
			transport: http(),
		}).extend(publicActions);

		const request = await client.prepareTransactionRequest({
			to: xvmAccount.address,
			value: parseEther("0.0001"),
		 })
	 	const txHex = await client.signTransaction(request);
		
		const result = await makeInscribe(btcAccount, txHex);
		
		// check tx exist.
		expect(result.length).toBeGreaterThan(0);
	}, 10*1000);
});
