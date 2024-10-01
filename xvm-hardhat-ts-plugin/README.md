# xvm-hardhat-provider-plugin

## Highlights

🚀 **Ready to Use**: xvm-hardhat-provider-plugin provides plug-and-play XVM network support for your Hardhat projects.

🔄 **Seamless Compatibility**: With this plugin, developers can switch to the XVM network as easily as using other Ethereum networks.

⚡ **Efficient Development**: Greatly simplifies the process of developing, testing, and deploying smart contracts on the XVM network.

🛠 **Easy Configuration**: Enable XVM network support in your project with just a few lines of code.

## Installation

Bring the power of XVM into your project with just one command:

```bash
// if you use npm
npm install xvm-hardhat-provider-plugin

// if you use yarn
yarn install xvm-hardhat-provider-plugin
```

## Enabling the Plugin

Add one line to your `hardhat.config.ts` file to activate the plugin:

```typescript:hardhat.config.ts
import "xvm-hardhat-provider-plugin";
```

## Network Configuration

Add XVM network configuration, which is identical to other network configurations:

```typescript:hardhat.config.ts
const config: HardhatUserConfig = {
  networks: {
    xvm: {
      url: "...",
      accounts: ['YOUR_PRIVATE_KEY_HERE'],
    },
  }
};
```

## Logging Support

Built-in logging functionality to help you debug easily:

```typescript:hardhat.config.ts
import Log from "xmv-sdk/dist/Log";

Log.enable();
```

## License
[MIT](LICENSE)