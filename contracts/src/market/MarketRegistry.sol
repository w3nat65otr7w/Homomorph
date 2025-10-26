// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MarketRegistry
 * @dev Providers register capabilities and pricing, consumers discover providers.
 */
contract MarketRegistry is Ownable {
    struct Provider {
        address account;
        string metadataURI;    // off-chain profile, capabilities
        uint256 basePriceWei;  // base price per job unit
        bool active;
    }

    mapping(address => Provider) public providers;
    address[] public providerList;

    event ProviderRegistered(address indexed account, string metadataURI, uint256 basePriceWei);
    event ProviderUpdated(address indexed account, string metadataURI, uint256 basePriceWei, bool active);

    constructor() Ownable(msg.sender) {}

    function registerProvider(string calldata metadataURI, uint256 basePriceWei) external {
        require(providers[msg.sender].account == address(0), "Already registered");
        providers[msg.sender] = Provider({
            account: msg.sender,
            metadataURI: metadataURI,
            basePriceWei: basePriceWei,
            active: true
        });
        providerList.push(msg.sender);
        emit ProviderRegistered(msg.sender, metadataURI, basePriceWei);
    }

    function updateProvider(string calldata metadataURI, uint256 basePriceWei, bool active) external {
        Provider storage p = providers[msg.sender];
        require(p.account != address(0), "Not registered");
        p.metadataURI = metadataURI;
        p.basePriceWei = basePriceWei;
        p.active = active;
        emit ProviderUpdated(msg.sender, metadataURI, basePriceWei, active);
    }

    function getProviders() external view returns (Provider[] memory list) {
        uint256 n = providerList.length;
        list = new Provider[](n);
        for (uint256 i = 0; i < n; i++) {
            list[i] = providers[providerList[i]];
        }
    }
}



