// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";
import "./LPSCRegistry.sol";
import "./LPSCVault.sol";

/**
 * @title LPSC Cross-Chain Payment and Settlement Contract
 * @dev Extends LPSCVault and LPSCRegistry, integrates with Chainlink CCIP for cross-chain interactions.
 * Inherits CCIPReceiver for receiving cross-chain messages.
 */
contract LPSC is LPSCVault, LPSCRegistry, CCIPReceiver {
    address private immutable _router;

    event ReplySent(
        bytes32 indexed replyMessageId,
        uint64 sourceChainSelector,
        bytes32 messageId,
        address indexed sender,
        address tokenToReturn,
        uint256 amount
    );

    /**
     * @dev Ensures that only the router or the contract owner can call certain functions.
     */
    modifier onlyRouterOrOwner() {
        require(msg.sender == _router || msg.sender == owner(), "LPSC: Unauthorized");
        _;
    }

    /**
     * @notice Constructor to set initial router and vault addresses.
     * @param routerAddress Address of the router for CCIP sending.
     * @param vaultAddress Address of the vault for managing funds.
     */
    constructor(address routerAddress, address vaultAddress)
        CCIPReceiver(routerAddress)
        LPSCVault(vaultAddress)
    {
        _router = routerAddress;
        // Approve router to spend LINK tokens indefinitely
        LinkTokenInterface(LINK).approve(routerAddress, type(uint256).max);
    }

    /**
     * @dev Handles incoming CCIP messages and initiates a reply with the necessary token transfer.
     */
    function _ccipReceive(Client.Any2EVMMessage memory receivedMessage) internal override {
        bytes32 messageId = receivedMessage.messageId;
        uint64 sourceChainSelector = receivedMessage.sourceChainSelector;
        (address tokenAddress, uint256 amount, address sender) = abi.decode(receivedMessage.data, (address, uint256, address));

        _reply(tokenAddress, amount, sourceChainSelector, sender, messageId);
    }

    /**
     * @notice Sends a reply message to the sender on the source chain with the specified token and amount.
     * @dev Only accessible by the router or the owner.
     */
    function reply(address tokenAddress, uint256 amount, uint64 sourceChainSelector, address sender, bytes32 messageId)
        external onlyRouterOrOwner
    {
        _reply(tokenAddress, amount, sourceChainSelector, sender, messageId);
    }

    /**
     * @dev Internal function to handle the logic for sending reply messages.
     */
    function _reply(address tokenAddress, uint256 amount, uint64 sourceChainSelector, address sender, bytes32 messageId) private {
        address tokenToReturn = s_destinationToSourceMap[keccak256(abi.encodePacked(tokenAddress, sourceChainSelector))];
        uint256 currentBalance = IERC20(tokenToReturn).balanceOf(address(this));

        // Withdraw from vault if insufficient funds
        if (currentBalance < amount) {
            withdrawFromVault(tokenToReturn, amount - currentBalance);
        }

        // Prepare token amount for sending
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({token: tokenToReturn, amount: amount});

        // Approve token transfer
        IERC20(tokenToReturn).approve(_router, amount);

        // Construct reply message
        Client.EVM2AnyMessage memory messageReply = Client.EVM2AnyMessage({
            receiver: abi.encode(sender),
            data: abi.encode(messageId),
            tokenAmounts: tokenAmounts,
            extraArgs: "",
            feeToken: LINK
        });

        // Send CCIP message
        bytes32 replyMessageId = IRouterClient(_router).ccipSend(sourceChainSelector, messageReply);

        // Emit event for the reply
        emit ReplySent(replyMessageId, sourceChainSelector, messageId, sender, tokenToReturn, amount);
    }
}
