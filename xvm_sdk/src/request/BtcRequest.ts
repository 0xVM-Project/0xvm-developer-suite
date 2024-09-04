import { UnspentOutput } from "@unisat/wallet-sdk";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import Log from "../Log";

export const TEST_HOST = "https://wallet-api-testnet.unisat.io";
export const MAIN_HOST = "";

interface BtcResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

interface FeeData {
  list: FeeOption[];
}

interface FeeOption {
  title: string;
  desc: string;
  feeRate: number;
}

export const getFeeRate = async (network: NetworkType) => {
  return fetch(`${getHost(network)}/v5/default/fee-summary`)
    .then((response) => response.text())
    .then(data => {
      Log.info(`Request success, URL: ${`${getHost(network)}/v5/default/fee-summary`}, Response: ${JSON.stringify(data)}`);
      return data;
    })
    .then((response) => {
      const feeResponse = JSON.parse(response) as BtcResponseData<FeeData>;
      return feeResponse.data.list.find(item => item.title === "Avg")?.feeRate!;
    })
    .catch((error) => {console.error(error); throw error});
};

export const getBtcUtxo = async (address: string, network: NetworkType) => {
  const url = `${getHost(network)}/v5/address/btc-utxo?address=${address}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      Log.info(`Btc Request success, URL: ${url}, Response: ${JSON.stringify(data)}`);
      return data;
    })
    .then((json) => (json as BtcResponseData<Omit<UnspentOutput, "pubkey">[]>).data)
    .catch(error => {
      console.error('Error getting BTC UTXO:', error);
      throw error;
    });
};


export const getHost = (network: NetworkType): string => {
  return network === NetworkType.TESTNET ? TEST_HOST : MAIN_HOST;
};

