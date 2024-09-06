import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@nomicfoundation/hardhat-toolbox";
import "xvm-hardhat-provider-plugin";
import Log from "xmv-sdk/dist/Log";

Log.enable();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: ["421fda3e773553e2dbbf75a09f3e6e76b5a9322678e0c1ecd70ba87a84111092"]
    },
    xvm: {
      url: "https://t-0xvm-rpc.0xvm.com",
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'],
    },
  }
};

export default config;
