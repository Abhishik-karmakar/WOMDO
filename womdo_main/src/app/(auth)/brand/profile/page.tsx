"use client";
import { useState, useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import "./profile.scss";
import { API_ROUTES, API_URL } from "@/utils/constants";
import toast from "react-hot-toast";
import ProfilePage from "@/components/brandProfile/profilePage";
import BrandOnboardForm from "@/components/brandOnboardForm/brandOnboardForm";
import { Container, Row } from "react-bootstrap";
import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import SmallTitle from "@/components/smalltitle/smalltitle";
import AdOnboardForm from "@/components/adOnboardForm/adOnboardForm";

const Profile = () => {
  interface ProfileData {
    brandName: string;
    category: string;
  }

  const { address, isConnected } = useWeb3ModalAccount();
  const [userExists, setUserExists] = useState(false);
  const [userData, setUserData] = useState<ProfileData>({
    brandName: "Your Brand Name",
    category: "Your Category",
  });

  useEffect(() => {
    if (isConnected) {
      handleCheckUserIsValid();
    }
  }, [isConnected]);

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
        setUserData(data.data[0]);
        setUserExists(!!data);
      } else {
        toast.error(
          "Brand does not exist with this wallet address. Please create your profile.",
          { id: 'toast' }
        );
        setUserExists(false);
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      setUserExists(false);
    }
  };

  const handleRefresh = () => {
    handleCheckUserIsValid();
  };

  return (
    <section className="profile_page">
      <SmallTitle title="Profile" className="text-start" />
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : (
        <Container>
          <Row>
            {!userExists ? (
              <BrandOnboardForm handleRefresh={handleRefresh} />
            ) : (
              <>
                <ProfilePage {...userData} />
                <AdOnboardForm />
              </>
            )}
          </Row>
        </Container>
      )}
    </section>
  );
};

export default Profile;
