"use client";
import { useState, useEffect } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import "./influencers.scss";
import { API_ROUTES, API_URL, ROUTES } from "@/utils/constants";
import toast from "react-hot-toast";
import { Col, Container, Row } from "react-bootstrap";
import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import SmallTitle from "@/components/smalltitle/smalltitle";
import Button from "@/components/button/button";
import { useRouter } from "next/navigation";
import InviteModal from "@/components/modals/inviteModal/inviteModal";

const Influencers = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [influencersList, setInfluencersList] = useState([]);
  const [influencerAddress, setInfluencerAddress] = useState("");
  const [show, setShow] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      handleGetInfluencers();
      handleCheckUserIsValid();
    }
  }, [isConnected, router]);

  const handleGetInfluencers = async () => {
    try {
      let response = await fetch(
        API_URL + API_ROUTES.GET_INFLUENCER_BY_CATEGORY + "/all",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setInfluencersList(data.data);
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

  const handleCheckUserIsValid = async () => {
    try {
      let response = await fetch(
        API_URL + API_ROUTES.GET_BRAND_AD + "/" + address,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
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

  return (
    <section className="influencers_page">
      <SmallTitle title="Influencers" className="text-start" />
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : (
        <Container>
          <Row>
            {influencersList && influencersList.length
              ? influencersList.map((influencer: any) => (
                  <Col xl={4} sm={6} key={influencer._id}>
                    <div className="influencers_card">
                      <h3>{influencer.name}</h3>
                      <p>Channel Name: {influencer.channelName}</p>
                      <p>Category: {influencer.category}</p>
                      <p>Total View Count: {influencer.totalViewCount}</p>
                      <p>Subscribers: {influencer.subscribers}</p>
                      <p>
                        Overall Watchtime: {influencer.overallWatchtime} hours
                      </p>
                      <p>
                        <a
                          href={influencer.channelLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Channel Link
                        </a>
                      </p>
                      <div className="influencers_progress"></div>
                      <Button
                        fluid
                        className="custom_btn"
                        onClick={() => {
                          setShow(true);
                          setInfluencerAddress(influencer.wallet);
                        }}
                      >
                        Invite
                      </Button>
                    </div>
                  </Col>
                ))
              : "No data found!"}
          </Row>
          <InviteModal
            influencerAddress={influencerAddress}
            show={show}
            handleClose={() => setShow(false)}
          />
        </Container>
      )}
    </section>
  );
};

export default Influencers;
