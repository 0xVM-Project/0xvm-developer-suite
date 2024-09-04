import {
  NetworkConfig
} from "hardhat/types";
import { isHDAccountsConfig } from "hardhat/internal/core/providers/construction";
import { derivePrivateKeys } from "hardhat/internal/core/providers/util";
import { bytesToHex } from "@nomicfoundation/ethereumjs-util";

/**
 * Converts network configuration to a private key
 * 
 * @param xvmNetwork - Network configuration object
 * @returns Private key as a string
 * @throws Error if the account configuration is invalid
 */
export function transmuteToPrivateKey(xvmNetwork: NetworkConfig): string {
  const accounts = xvmNetwork.accounts;

  if (Array.isArray(accounts)) {
    return (accounts as string[])[0];
  } else if (isHDAccountsConfig(accounts)) {
    const {
      mnemonic,
      path: hdpath,
      initialIndex,
      count,
      passphrase,
    } = accounts;

    const trimmedMnemonic = mnemonic.trim();

    const privateKeys = derivePrivateKeys(
      trimmedMnemonic,
      hdpath,
      initialIndex,
      count,
      passphrase
    );
    return bytesToHex(privateKeys[0]);
  }
  throw new Error("Invalid accounts configuration");
}