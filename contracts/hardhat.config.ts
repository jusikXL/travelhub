import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2 ** 32 - 1,
      },
    },
  },
  networks: {
    fuse_spark: {
      url: `https://rpc.fusespark.io`,
      chainId: 123,
    },
  },
};

export default config;
