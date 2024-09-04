import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import Log from "../Log";

const ServiceConfig = {
	test: {
		HOST: "https://t-wallet-api.0xvm.com",
		RECEIVER_ADDRESS:
			"tb1pkuztaw644p59r8rg2dvpueqd64auavdj5tsafmckkx4hd3awrursewzq32",
	},
	mainnet: {
		HOST: "",
		RECEIVER_ADDRESS: "",
	},
};

interface XVMResponseData<T> {
	code: number;
	data: T;
	errorMessage: string;
}

interface CreateInscribeData {
	id: string;
	address: string;
	amount: number;
}

interface CreateRevealData {
	hash: string;
}

interface AddressMappingData {
	xvmAddress: string;
	btcAddress: string;
	sig: string;
}

export class XVMClient {

	private host: string;
	private receiverAddress: string;

	constructor(network: NetworkType) {
    const serviceConfig = network === NetworkType.MAINNET ? ServiceConfig.mainnet : ServiceConfig.test;

		this.host = serviceConfig.HOST;
		this.receiverAddress = serviceConfig.RECEIVER_ADDRESS;
	}

	public createCommit = (content: string, feeRate: number) => {
		const body = JSON.stringify({
			content: content,
			receiverAddress: this.receiverAddress,
			feeRate: feeRate,
		});

		return createRequest<CreateInscribeData>(body, "inscribe/create_inscribe", this.host);
	};

	public createReveal = (id: string, tx: string) => {
		const body = JSON.stringify({
			id: id,
			tx: tx,
		});

		return createRequest<CreateRevealData>(body, "inscribe/commit_inscribe", this.host);
	};

  public addressMapping = (xvmAddress: string, btcAddress: string, sig: string) => {
    const body = JSON.stringify({
      xvmAddress: xvmAddress,
      btcAddress: btcAddress,
      sig: sig,
    });

    return createRequest<AddressMappingData>(body, "address-mapping", this.host);
  };

}

const createRequest = <T>(body: string, path: string, host: string) => {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	const requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: body,
	};

	return fetch(`${host}/${path}`, requestOptions)
		.then((response) => response.text())
		.then((result) => {
			Log.info(`XVM Request success, URL: ${`${host}/${path}`}, Data: ${JSON.stringify(requestOptions)}, Response: ${result}`);
			return result;
		})
		.then((response) => JSON.parse(response) as XVMResponseData<T>)
		.catch((error) => {
			console.error(error);
			throw error;
		});
};