// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "./SimpleAccount.sol";

/**
 * A sample factory contract for SimpleAccount
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
contract SimpleAccountFactory {
    SimpleAccount public immutable accountImplementation;
    mapping(address => uint) private balance;
    address public owner;

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new SimpleAccount(_entryPoint);
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /**
     * create an account and return its address.
     * returns the address even if the account is already deployed.
     * note that during UserOperation execution, this method is called only if the account is not deployed.
     * this method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation.
     */
    function createAccount(address _owner, uint256 salt) public returns (SimpleAccount) {
        address addr = getCreatedAddress(_owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return SimpleAccount(payable(addr));
        }

        address proxyAddress = address(new ERC1967Proxy{salt: bytes32(salt)}(
            address(accountImplementation),
            abi.encodeWithSignature("initialize(address)", _owner)
        ));
        return SimpleAccount(payable(proxyAddress));
    }

     /**
     * calculate the counterfactual address of this account as it would be returned by createAccount().
     */
    function getCreatedAddress(address newaddress, uint256  newsalt) public view returns (address) {
        return Create2.computeAddress(
            bytes32(newsalt),
            keccak256(
                abi.encodePacked(
                    type(ERC1967Proxy).creationCode,
                    abi.encode(address(accountImplementation), abi.encodeWithSignature("initialize(address)", newaddress))
                )
            )
        );
    }  

    /**
     * check current account deposit in the entryPoint
     */
    function getDeposit(address account) public view returns (uint256) {
        return balance[account];
    }

    /**
     * deposit more funds for this account in the entryPoint
     */
    function addDeposit(address account) public payable {
        balance[account] += msg.value;
    }

     /**
     * send funds from a specific SimpleAccount to an external address.
     * @param account The SimpleAccount address to withdraw from.
     * @param recipient The external address to send the funds to
     * @param amount The amount to withdraw.
     */
    function sendFund(address account ,address payable recipient, uint256 amount)  public onlyOwner {
        require(balance[account] >= amount, "Insufficient balance in the contract");
        recipient.transfer(amount);
        balance[account] -= amount;
    }
}
