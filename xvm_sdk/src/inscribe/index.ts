import { sendBTC } from "@unisat/wallet-sdk/lib/tx-helpers";
import { getBtcUtxo, getFeeRate } from "../request/BtcRequest";
import { XVMClient } from "../request/XVMRequest";
import { BtcAccount } from "..";
import { ethers } from "ethers";
import { PROTOCOL } from "./type";
import { inscriptionLabel, inscriptionVersion } from "./config";
import * as flatbuffers from 'flatbuffers';
import * as Flatbuffers from './flatbuffers/output/zxvm';

export async function makeInscribe(
	btcAccount: BtcAccount,
	ethTx: string
): Promise<string> {
	const feeRate = await getFeeRate(btcAccount.networkType);

	const xvmClient = new XVMClient(btcAccount.networkType);

	const protocolTx = wrapTransaction(ethTx);
	const commitResponse = (await xvmClient.createCommit(protocolTx, feeRate)).data;

	const unspentOutput = await getBtcUtxo(btcAccount.address, btcAccount.networkType);

	const { psbt } = await sendBTC({
		btcUtxos: unspentOutput.map(item => ({ ...item, pubkey: btcAccount.pubkey })),
		tos: [{ address: commitResponse.address, satoshis: commitResponse.amount }],
		networkType: btcAccount.networkType,
		changeAddress: btcAccount.address,
		feeRate,
	});

	const signedPsbt = await btcAccount.signPsbt(psbt, { autoFinalized: true });

	const revealResponse = (await xvmClient.createReveal(commitResponse.id, signedPsbt.extractTransaction().toHex())).data;

	return revealResponse.hash;
}

function wrapTransaction(ethTx: string): string {
	const action = getProtocolType(ethTx);
	
	const transaction: PROTOCOL.JsonObject = { action: action, data: ethTx };

	return generateTransaction(
                base64Encode(
					encodeTransaction([transaction] as PROTOCOL.JsonObjectList)!
				)
              );

}

function encodeTransaction(_transactions?: PROTOCOL.JsonObjectList) {
    let result: Uint8Array | undefined = undefined;
    const builder = new flatbuffers.Builder(0);

    if (_transactions?.length) {
      const contentOffset = _transactions.map((_transaction) => {
        const dataOffset = builder.createString(_transaction.data);
        Flatbuffers.Data.startData(builder);
        Flatbuffers.Data.addAction(builder, _transaction.action);
        Flatbuffers.Data.addData(builder, dataOffset);
        return Flatbuffers.Data.endData(builder);
      });

      const contentVectorOffset = Flatbuffers.Transaction.createContentVector(builder, contentOffset);
      Flatbuffers.Transaction.startTransaction(builder);
      Flatbuffers.Transaction.addContent(builder, contentVectorOffset);
      const transactionOffset = Flatbuffers.Transaction.endTransaction(builder);
      builder.finish(transactionOffset);
      result = builder.asUint8Array();
    }

    return result;
  };

function getProtocolType(ethTx: string): PROTOCOL.Action {
	let tx = ethers.Transaction.from(ethTx);

	const to = tx.to;
	const callData = tx.data;
	const value = tx.value;

	const isDeploy = (!to || to === ethers.ZeroAddress) && callData;
	const isMint = to && ethers.isAddress(to) && to !== ethers.ZeroAddress && value;

	const action = isDeploy ? 1 : isMint ? 2 : 3;

	return action;
}

function generateTransaction(_string: string) {
    return inscriptionLabel + inscriptionVersion + _string;
  };

function base64Encode(_buffer: Uint8Array) {
    return Buffer.from(_buffer).toString('base64');
};