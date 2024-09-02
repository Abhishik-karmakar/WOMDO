// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TetherUSD is ERC20, Ownable, ERC20Permit {
    constructor(
        address initialOwner
    )
        ERC20("Tether USD", "USDT")
        Ownable(initialOwner)
        ERC20Permit("Tether USD")
    {
        _mint(msg.sender, 1000000000000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
