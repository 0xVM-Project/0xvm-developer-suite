import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { describe, expect, test } from "@jest/globals";
import { ECPair } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { privateKeysToAccount, privateKeyToAccount } from "..";
import Log from "../Log";

describe("Service module", () => {

	test("addressMapping first time, should be new binding", async () => {
		const privateKey = ECPair.makeRandom().privateKey?.toString("hex") ?? "";

		let result = await privateKeyToAccount(privateKey, NetworkType.TESTNET);

		expect(result.isNewBinding).toBe(true);
	});

	test("addressMapping second time, should not be new binding", async () => {
		const privateKey = ECPair.makeRandom().privateKey?.toString("hex") ?? "";

		await privateKeyToAccount(privateKey, NetworkType.TESTNET);

		const result = await privateKeyToAccount(privateKey, NetworkType.TESTNET);
		expect(result.isNewBinding).toBe(false);
	});

	test("illegal addressMapping should failed", async () => {
		const ethPrivateKey = ECPair.makeRandom().privateKey?.toString("hex") ?? "";
		const btcPrivateKey = ECPair.makeRandom().privateKey?.toString("hex") ?? "";

		await privateKeyToAccount(ethPrivateKey, NetworkType.TESTNET);

		await expect(
			privateKeysToAccount(ethPrivateKey, btcPrivateKey, NetworkType.TESTNET)
		).rejects.toThrowError();
		
		// expect(result.isNewBinding).toBe(false);
	}, 10 * 1000);

});
