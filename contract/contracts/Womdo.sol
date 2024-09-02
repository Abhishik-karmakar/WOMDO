// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

import "./libraries/TransferHelper.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Womdo is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent
    bytes32 public s_lastRequestId;

    uint256 public totalAds;
    uint256[] public returnedArray;

    IERC20Metadata public USDT;

    mapping(address => mapping(uint256 => AdInfo)) public userAds;
    mapping(address => mapping(uint256 => address[]))
        public acceptedUserAddress;
    mapping(uint256 => address) public adOwner;
    mapping(address => mapping(uint256 => bool)) public isInfluencerAccepted;
    mapping(address => mapping(uint256 => bool)) public isInfluencerClaimed;
    mapping(uint256 => uint256[]) public influencerShare;

    /* ======= STRUCT ======== */
    struct AdInfo {
        uint256 totalUsers;
        uint256 usdtAmount;
    }

    /* ======= EVENTS ======== */
    event AdRegistered(
        uint256 adId,
        uint256 totalUsers,
        uint256 usdtAmount,
        address brandAddress,
        string productName
    );

    event AdAccepted(
        uint256 adId,
        address influencer,
        address[] acceptedUserAddress
    );

    event Claimed(uint256 adId, address influencer, uint256 share);

    /* ======= FUNCTIONS ======== */
    constructor(
        address router,
        bytes32 _donId,
        address _udst
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
        USDT = IERC20Metadata(_udst);
    }

    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    function registerAd(
        uint256 _users,
        uint256 _usdtAmount,
        string memory _productName
    ) public {
        require(
            USDT.balanceOf(msg.sender) >= _usdtAmount,
            "User doesn't have enough balance."
        );
        require(
            USDT.allowance(msg.sender, address(this)) >= _usdtAmount,
            "User doesn't have enough allowance."
        );

        totalAds++;

        adOwner[totalAds] = msg.sender;

        AdInfo memory adInfo = AdInfo({
            totalUsers: _users,
            usdtAmount: _usdtAmount
        });

        userAds[msg.sender][totalAds] = adInfo;

        TransferHelper.safeTransferFrom(
            address(USDT),
            msg.sender,
            address(this),
            _usdtAmount
        );

        emit AdRegistered(
            totalAds,
            _users,
            _usdtAmount,
            msg.sender,
            _productName
        );
    }

    function acceptAd(uint256 _adId) public {
        require(_adId <= totalAds, "Invalid adId");

        address[] storage allInfluencers = acceptedUserAddress[adOwner[_adId]][
            _adId
        ];

        AdInfo memory _adInfo = userAds[adOwner[_adId]][_adId];

        require(allInfluencers.length < _adInfo.totalUsers, "Ad is full");
        require(
            !isInfluencerAccepted[msg.sender][_adId],
            "Influencer already accepted"
        );

        allInfluencers.push(msg.sender);
        isInfluencerAccepted[msg.sender][_adId] = true;

        emit AdAccepted(_adId, msg.sender, allInfluencers);
    }

    function claim(uint256 _adId) public {
        require(
            isInfluencerAccepted[msg.sender][_adId],
            "Influencer is not applicable to claim"
        );

        require(!isInfluencerClaimed[msg.sender][_adId], "Already Claimed");

        AdInfo storage adInfo = userAds[adOwner[_adId]][_adId];
        uint256 userIndex;

        address[] memory allInfluencers = acceptedUserAddress[adOwner[_adId]][
            _adId
        ];

        for (uint256 i = 0; i < allInfluencers.length; i++) {
            if (allInfluencers[i] == msg.sender) {
                userIndex = i;
                break;
            }
        }

        uint256 _userSharePercentage = influencerShare[_adId][userIndex];
        uint256 _share = (adInfo.usdtAmount * _userSharePercentage) / (100_00);
        require(_share > 0, "Share should be greater than 0");

        isInfluencerClaimed[msg.sender][_adId] = true;

        TransferHelper.safeTransfer(address(USDT), msg.sender, _share);

        emit Claimed(_adId, msg.sender, _share);
    }

    function sendRequest(
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external {
        FunctionsRequest.Request memory req;

        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );

        req.secretsLocation = secretsLocation;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        uint256[] memory result = decodeArray(response);
        influencerShare[result[result.length - 1]] = result;
    }

    function fulfillRequestLocal(bytes memory response) public {
        uint256[] memory result = decodeArray(response);
        influencerShare[result[result.length - 1]] = result;
    }

    function decodeArray(
        bytes memory encodedData
    ) internal pure returns (uint256[] memory) {
        require(encodedData.length % 32 == 0, "Invalid encoded data length");

        uint256[] memory result = new uint256[](encodedData.length / 32);

        for (uint256 i = 0; i < result.length; i++) {
            uint256 value;
            assembly {
                value := mload(add(add(encodedData, 0x20), mul(i, 0x20)))
            }
            result[i] = value;
        }

        return result;
    }

    // function decodeArray(
    //     bytes memory encodedArray
    // ) internal pure returns (uint256[] memory) {
    //     return abi.decode(encodedArray, (uint256[]));
    // }
}
