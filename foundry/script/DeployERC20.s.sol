// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "forge-std/Script.sol";
import "../src/SimpleERC20.sol";

contract DeployERC20 is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        new SimpleERC20(1000 ether);
        vm.stopBroadcast();
    }
}