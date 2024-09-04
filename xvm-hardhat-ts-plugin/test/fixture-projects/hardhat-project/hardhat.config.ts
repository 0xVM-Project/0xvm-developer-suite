// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";

import "../../../src/index";
import { id } from "ethers";

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "substrate",
  networks: {
    hardhat: {},
    substrate: {
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
      url: "https://t-0xvm-rpc.0xvm.com"
    },
  },
};