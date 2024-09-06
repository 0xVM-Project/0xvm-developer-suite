// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";
import path from "path";
import Log from "xmv-sdk/dist/Log";

Log.enable();
Log.debug("Hello, world!");

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {
  describe("Hardhat Runtime Environment extension", function () {
    useEnvironment("hardhat-project");

    it.only("Should add the example field", async function () {
      
      const tx = "0x01f8fc82210583042f188501f6f6ffcc83067a2394e5abd2089568eb38831355f3680f4ba2c81a22b680b85600000001f81609423f162c00000000aca7b4010b77705a00000000000015d7fd8fd56872750100017db1c9f51f2cb456f0c5d7e2f939fa7f6b36014200001988cef98b0b3bc675d1ed53c34eb239c6c4bf99ef010000f838f7944200000000000000000000000000000000000006e1a0f2929a1ac4341a8f0843674df51c73e4456d1549677a3a5567c854db10adeb4380a0dce570b83fd006db270ea755d992895288b627bb912156b5786f022eba99138fa064357c633c8c2888256dc361c75adc349b9565c908bb0dc8708a5722c5fd0b8a";
      const res = await this.hre.network.provider.send("eth_sendRawTransaction", ["0x01f8fc82210583042f188501f6f6ffcc83067a2394e5abd2089568eb38831355f3680f4ba2c81a22b680b85600000001f81609423f162c00000000aca7b4010b77705a00000000000015d7fd8fd56872750100017db1c9f51f2cb456f0c5d7e2f939fa7f6b36014200001988cef98b0b3bc675d1ed53c34eb239c6c4bf99ef010000f838f7944200000000000000000000000000000000000006e1a0f2929a1ac4341a8f0843674df51c73e4456d1549677a3a5567c854db10adeb4380a0dce570b83fd006db270ea755d992895288b627bb912156b5786f022eba99138fa064357c633c8c2888256dc361c75adc349b9565c908bb0dc8708a5722c5fd0b8a"]);
      console.log("res = ", res);

      const txHex = await this.hre.network.provider.send("eth_getTransactionByHash", [res]);
      console.log("tx = ", txHex);

    });
  });

});
