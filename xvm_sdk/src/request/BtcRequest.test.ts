import { describe, expect, test } from "@jest/globals";
import { getFeeRate, getHost, TEST_HOST } from "./BtcRequest";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";

describe("Viem module", () => {

	test("get host by network", async () => {
		const host = getHost(NetworkType.TESTNET);
		
		expect(host).toBe(TEST_HOST);
	});

	test("get fee rate", async () => {
		const feeRate = await getFeeRate(NetworkType.TESTNET);
	
		expect(feeRate).toBeGreaterThan(0);
	});
});
