"use client";
import { useState, useEffect } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import "./myAds.scss";
import { API_ROUTES, API_URL, ROUTES, UsdtAddress } from "@/utils/constants";
import toast from "react-hot-toast";
import { Col, Container, Row } from "react-bootstrap";
import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import SmallTitle from "@/components/smalltitle/smalltitle";
import Button from "@/components/button/button";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import UsdtAbi from "../../abi/TetherUSD.json";

const MyAds = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider }: any= useWeb3ModalProvider();
  const [userData, setUserData]: any = useState({});
  const [decimals, setDecimals] = useState(6);

  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      handleCheckUserIsValid();
    }
  }, [isConnected, router]);

  const handleCheckUserIsValid = async () => {
    try {
      let response = await fetch(
        API_URL + API_ROUTES.GET_BRAND_AD + "/" + address,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        let data = await response.json();
        handleGetDecimal();
        setUserData(data.data[0]);
      } else {
        toast.error(
          "Brand does not exist with this wallet address. Please create your profile.",
          { id: "toast" }
        );
        router.push(ROUTES.BRAND_PROFILE);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  };

  const handleGetDecimal = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    const UsdtContract = new ethers.Contract(UsdtAddress, UsdtAbi, signer);
    const decimal = await UsdtContract.decimals();
    setDecimals(decimal);
  };

  return (
    <section className="myAds_page">
      <SmallTitle title="My Ads" className="text-start" />
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : (
        <Container>
          <Row>
            {userData?.ads && userData.ads.length > 0 ? (
              userData.ads.map((ad: any) => (
                <Col xl={4} sm={6} key={ad._id}>
                  <div className="myAds_card">
                    <div className="myAds_card_img"></div>
                    <h3>{ad.productName}</h3>
                    <div className="myAds_progress">
                      <div className="myAds_progress_details">
                        <h4>Budget</h4>
                        <p>{`${ethers.utils.formatUnits(
                          ad.budget,
                          decimals
                        )} USDT`}</p>
                      </div>
                      <div className="myAds_progress_details">
                        <h4>Number of Ads</h4>
                        <p>{ad.numberOfTargetedAds}</p>
                      </div>
                      <div className="myAds_progress_details">
                        <h4>Ad Id</h4>
                        <p>{ad.adId}</p>
                      </div>
                    </div>
                    {/* <Button fluid className="custom_btn">
                      Check stats
                    </Button> */}
                  </div>
                </Col>
              ))
            ) : (
              <Col>
                <p>No data found!</p>
              </Col>
            )}
          </Row>
        </Container>
      )}
    </section>
  );
};

export default MyAds;
