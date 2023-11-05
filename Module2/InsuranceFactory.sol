// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the separate insurance contract files
import "./Insurance.sol";
import "./WalletInsurance.sol";
import "./LoanInsurance.sol";

// Factory contract to create and manage insurance contracts
contract InsuranceFactory {
    // Mapping to store addresses of created insurance contracts
    mapping(address => Insurance) public contracts;

    // Function to create a new WalletInsurance contract
    function createWalletInsurance(address _insured, uint _premium, uint _coverageAmount) public returns (address) {
        // Deploy a new WalletInsurance contract
        WalletInsurance i = new WalletInsurance(_insured, _premium, _coverageAmount);
        
        // Store the contract address in the mapping
        contracts[_insured] = i;

        // Return the contract address
        return address(i);
    }

    // Function to create a new LoanInsurance contract
    function createLoanInsurance(address _insured, uint _premium, uint _coverageAmount) public returns (address) {
        // Deploy a new LoanInsurance contract
        LoanInsurance i = new LoanInsurance(_insured, _premium, _coverageAmount);
        
        // Store the contract address in the mapping
        contracts[_insured] = i;

        // Return the contract address
        return address(i);
    }
}
