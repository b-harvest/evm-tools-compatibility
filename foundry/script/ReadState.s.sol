// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ReadState is Script {
    /// @notice Run entrypoint accepts the token contract address as an argument.
    function run() external {
        address tokenAddr = vm.envAddress("CONTRACT");
        address acc1 = vm.envAddress("ACCOUNT_1");

        ERC20 token = ERC20(tokenAddr);

        console.log("totalSupply():", token.totalSupply());
        console.log("balanceOf(acc1):", token.balanceOf(acc1));
        console.log("name():", token.name());
        console.log("symbol():", token.symbol());
        console.log("decimals():", Strings.toString((token.decimals())));
    }
}