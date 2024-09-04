import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { describe, expect, test } from "@jest/globals";
import { ECPair } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { privateKeyToAccount } from "..";

describe("Service module", () => {
	test.only("addressMapping first time, should be new binding", async () => {
		const privateKey = ECPair.makeRandom().privateKey?.toString("hex") ?? "";

		const result = await privateKeyToAccount(privateKey, NetworkType.TESTNET);

		expect(result.isNewBinding).toBe(true);
	});

	test("addressMapping second time, should not be new binding", async () => {
		const privateKey =
			"421fda3e773553e2dbbf75a09f3e6e76b5a9322678e0c1ecd70ba87a84111092";
		const xvmAddress = "0x8239B294E0DC30449d7b5A20130D16b8D6C798a4";
		const btcAddress =
			"tb1phg33wmn437elqt4s0davl6v9eec9gsma3qutugqpvp9xq4l2zymss7ke9f";

		const result = await privateKeyToAccount(privateKey, NetworkType.TESTNET);

		expect(result.isNewBinding).toBe(false);
		expect(result.btcAddress).toEqual(btcAddress);
		expect(result.xvmAddress).toEqual(xvmAddress);
	});
});
