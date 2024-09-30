## Introduction

This SDK enables seamless interaction between the Ethereum (ETH) and Bitcoin (BTC) networks through the use of XVM Account. XVM Account is compatible with both blockchain ecosystems, allowing developers to generate accounts that work with both ETH and BTC using private keys.

The SDK integrates the Viem library, simplifying blockchain operations such as transaction preparation, signing, and sending. By extending wallet functionality (`xvmWalletActions`), developers can convert Ethereum-based transactions into XVM-compatible transactions, ensuring smooth multi-chain operations.

## Adding Dependencies

You can install the necessary dependencies using `npm` or `yarn`:

```bash
# Using npm
npm install xvm-sdk @unisat/wallet-sdk ethers viem

# Using yarn
yarn add xvm-sdk @unisat/wallet-sdk ethers viem
```

## XVM Account

The `XVM Account` is compatible with Ethereum address formats and allows you to create accounts that interact with both the BTC and ETH networks using an Ethereum private key. The `privateKeysToAccount` method generates XVM accounts.

### How to Generate an XVM Account?

To generate an XVM Account, you need to provide two private keys: one for the Ethereum network and one for the Bitcoin network. The `privateKeysToAccount` function will return two accounts: an `xvmAccount` (compatible with ETH addresses) and a `btcAccount` (compatible with BTC addresses).

**Note**: Ensure that the generated BTC address has available UTXOs (unspent transaction outputs). These UTXOs are required for signing transactions or performing inscription operations. Without UTXOs, the address will not be able to execute these actions.

#### Example Code:

```typescript
import { privateKeysToAccount } from "..";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";

const xvmPrivateKey = "your-eth-private-key";
const btcPrivateKey = "your-btc-private-key";

const { xvmAccount, btcAccount } = await privateKeysToAccount(
  xvmPrivateKey,
  btcPrivateKey,
  NetworkType.TESTNET
);
```

- `xvmPrivateKey`: Ethereum private key to generate an account compatible with the ETH network.
- `btcPrivateKey`: Bitcoin private key to generate an account compatible with the BTC network.
- `NetworkType.TESTNET`: Test network type.
- **Note**: For inscription operations, `btcAccount` must have available UTXOs. Without UTXOs, transactions cannot be successfully completed.

## Using with Viem

`Viem` is a powerful wallet client library that supports a variety of blockchain operations. By combining `Viem` with `XVM Account`, developers can simplify their workflow.

### Creating a Wallet Client

You can create a wallet client using the `createWalletClient` method and extend `xvmWalletActions` to convert Ethereum transactions into XVM transactions.

#### Example Code:

```typescript
import { createWalletClient, http, publicActions } from "viem";
import { sepolia } from "viem/chains";
import { xvmWalletActions } from ".";

const { xvmAccount, btcAccount } = await privateKeysToAccount(
  xvmPrivateKey,
  btcPrivateKey,
  NetworkType.TESTNET
);

const client = createWalletClient({
  account: xvmAccount, // XVM Account
  chain: { ...sepolia }, // Selected chain, such as the Sepolia testnet
  transport: http(),
})
  .extend(publicActions) // Extend public actions
  .extend((client) => xvmWalletActions(client, btcAccount)); // Extend XVM wallet actions
```

### Sending Raw Transactions

With the `Viem` client, you can prepare and send raw transactions. The following steps demonstrate how to use the `prepareTransactionRequest` method to create a transaction request and then sign and send the transaction using `signTransaction` and `sendRawTransaction`.

#### Example Code:

```typescript
const request = await client.prepareTransactionRequest({
  to: "0x...", // Target account address
  value: parseEther("0.0001"), // Transaction amount
});

const txHex = await client.signTransaction(request); // Sign the transaction
const result = await client.sendRawTransaction({
  serializedTransaction: txHex,
}); // Send the transaction
```

After the transaction is successfully sent, you can view the transaction on the XVM explorer once the BTC network confirms the block.