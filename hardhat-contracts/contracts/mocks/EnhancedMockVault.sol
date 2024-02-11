// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IBurnMintERC677Helper {
    function drip(address to) external;
}

contract EnhancedMockVault {
    // Event declarations
    event Deposit(address indexed asset, address indexed from, uint256 amount);
    event Withdrawal(address indexed asset, address indexed to, uint256 amount);

    // Mapping to track balances
    mapping(address => mapping(address => uint256)) public balances;

    /**
     * @dev Deposits a specified amount of an asset into the vault for the sender.
     * This mock version simply increments the balance in the contract.
     * In a real implementation, you would handle actual asset transfers here.
     */
    function deposit(address asset, uint256 amount) external {
        // Simulate deposit by increasing balance (In real use, transfer tokens here)
        balances[asset][msg.sender] += amount;
        emit Deposit(asset, msg.sender, amount);
    }

    /**
     * @dev Withdraws a specified amount of an asset from the vault to a given address.
     */
    function withdraw(address asset, uint256 amount, address to) external returns (uint256) {
        require(balances[asset][msg.sender] >= amount, "Insufficient balance");
        // Decrease the sender's balance before transferring to prevent re-entrancy attacks
        balances[asset][msg.sender] -= amount;

        // In a real implementation, you would handle actual asset transfers here.
        // For this mock, we simulate it by calling drip to the `to` address.
        IBurnMintERC677Helper(asset).drip(to);

        emit Withdrawal(asset, to, amount);
        return amount;
    }

    /**
     * @dev Returns the balance of an asset held in the vault for a given account.
     */
    function balanceOf(address asset, address account) external view returns (uint256) {
        return balances[asset][account];
    }
}
