import { sendBTC } from "@unisat/wallet-sdk/lib/tx-helpers";
import { getBtcUtxo, getFeeRate } from "../request/BtcRequest";
import { XVMClient } from "../request/XVMRequest";
import { BtcAccount } from "..";

export async function makeInscribe(
	btcAccount: BtcAccount,
	ethTx: string
): Promise<string> {
	const feeRate = await getFeeRate(btcAccount.networkType);

	const xvmClient = new XVMClient(btcAccount.networkType);
	const commitResponse = (await xvmClient.createCommit(ethTx, feeRate)).data;

	const unspentOutput = await getBtcUtxo(btcAccount.address, btcAccount.networkType);
  
	const { psbt } = await sendBTC({
		btcUtxos: unspentOutput.map(item => ({...item, pubkey: btcAccount.pubkey})),
		tos: [{ address: commitResponse.address, satoshis: commitResponse.amount }],
		networkType: btcAccount.networkType,
		changeAddress: btcAccount.address,
		feeRate,
	});

  const signedPsbt = await btcAccount.signPsbt(psbt, { autoFinalized: true});
  
  const revealResponse = (await xvmClient.createReveal(commitResponse.id, signedPsbt.extractTransaction().toHex())).data;  

	return revealResponse.hash;
}