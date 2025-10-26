// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Slashing
 * @dev Minimal placeholder for penalizing misbehavior. Actual policy TBD.
 */
contract Slashing is Ownable {
    mapping(address => uint256) public penalties;

    event Penalized(address indexed provider, uint256 amount, string reason);

    constructor() Ownable(msg.sender) {}

    function slash(address provider, uint256 amount, string calldata reason) external onlyOwner {
        penalties[provider] += amount;
        emit Penalized(provider, amount, reason);
    }
}



