"use client";
import { useState, useEffect } from "react";
import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import InfluencerOnboardForm from "@/components/influencerOnboardForm/influencerOnboardForm";
import SmallTitle from "@/components/smalltitle/smalltitle";
import { Container, Row } from "react-bootstrap";
import ProfilePage from "@/components/influencerProfile/profilePage";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import "./profile.scss";
import { API_ROUTES, API_URL } from "@/utils/constants";
import toast from "react-hot-toast";

const InfluencerProfile = () => {
  interface ProfileData {
    name: string;
    channelName: string;
    totalViewCount: number;
    subscribers: number;
    overallWatchtime: number;
    category: string;
    wallet: string;
    channelLink: string;
    email: string;
  }
  
  const { address, isConnected } = useWeb3ModalAccount();
  const [userExists, setUserExists] = useState(false);
  const [userData, setUserData] = useState<ProfileData>({
    name: "",
    channelName: "",
    totalViewCount: 0,
    subscribers: 0,
    overallWatchtime: 0,
    category: "",
    wallet: "",
    channelLink: "",
    email: "",
  });
  
  useEffect(() => {
    if (isConnected) {
      handleCheckUserIsValid();
    }
  }, [isConnected]);

  const handleCheckUserIsValid = async () => {    
    try {
      let response = await fetch(API_URL + API_ROUTES.GET_INFLUENCER + '/' + address, { 
        method: "GET",
      });
      
      if (response.ok) {
        let data = await response.json();
        setUserData(data.data);
        setUserExists(!!data);
      } else {
        toast.error("Influencer does not exist with this wallet address. Please create your profile.", { id: "toast" });
        setUserExists(false);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      setUserExists(false);
    }
  };

  const handleRefresh = () => {
    handleCheckUserIsValid();
  }

  return (
    <section className="profile_page">
      <SmallTitle title="Profile" className="text-start" />
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : (
        <Container>
          <Row>
            {!userExists ? (
              <InfluencerOnboardForm handleRefresh={handleRefresh}/>
            ) : (
              <ProfilePage {...userData} />
            )}
          </Row>
        </Container>
      )}
    </section>
  );
};

export default InfluencerProfile;
