"use client";
import React, { useState, useEffect } from "react";
import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import "./invitations.scss";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import SmallTitle from "@/components/smalltitle/smalltitle";
import { Button, Container, Row, Table } from "react-bootstrap";
import {
  API_ROUTES,
  API_URL,
  ROUTES,
  UsdtAddress,
  WomdoAddress,
} from "@/utils/constants";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import WomdoAbi from "../../abi/Womdo.json";
import { getError } from "@/utils/common.service";
import Loader from "@/components/loader/loader";

const Invitations = () => {
  const [loader, setLoader] = useState(false);
  const { address, isConnected } = useWeb3ModalAccount();
  const [invitations, setInvitations] = useState([]);
  const router = useRouter();
  const { walletProvider }: any = useWeb3ModalProvider();

  useEffect(() => {
    if (isConnected) {
      handleCheckUserIsValid();
    }
  }, [isConnected]);

  const handleGetInvitations = async () => {
    try {
      const response = await fetch(
        API_URL + API_ROUTES.GET_INFLUENCER_INVITATIONS + address,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (data.status) {
        setInvitations(data.data);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleCheckUserIsValid = async () => {
    try {
      let response = await fetch(
        API_URL + API_ROUTES.GET_INFLUENCER + "/" + address,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        toast.error(
          "Influencer does not exist with this wallet address. Please create your profile.",
          { id: "toast" }
        );
        router.push(ROUTES.INFLUENCER_PROFILE);
      } else {
        handleGetInvitations();
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  };

  const handleAccept = async (id: string) => {
    console.log("id", id);
    if (!isConnected) {
      toast.error("Please connect wallet!");
      return;
    }

    try {
      setLoader(true);
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const WomdoContract = new ethers.Contract(WomdoAddress, WomdoAbi, signer);
      const gasLimit = await WomdoContract.estimateGas.acceptAd(id);
      const acceptAd = await WomdoContract.acceptAd(id, {
        gasLimit: gasLimit,
      });
      const reciept = await acceptAd.wait(1);
      if (!reciept) {
        toast.error("Register Ad failed", { id: "toast" });
        return;
      }
      setLoader(false);
      toast.success("Invitation accepted successfully!", { id: "toast" });
    } catch (error: any) {
      setLoader(false);
      toast.error(getError(error), { id: "toast" });
    }
  };

  const handleDecline = async (id: string) => {
    // Implement decline functionality
    // try {
    //   const response = await fetch(
    //     API_URL + API_ROUTES.DECLINE_INVITATION + id,
    //     {
    //       method: "POST",
    //     }
    //   );
    //   const data = await response.json();
    //   if (data.status) {
    //     toast.success("Invitation declined successfully");
    //     fetchData(); // Refresh the invitations list
    //   }
    // } catch (error) {
    //   console.error("Error declining invitation:", error);
    // }
  };

  return (
    <section className="profile_page">
      <SmallTitle title="Invitations" className="text-start" />
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : loader ? (
        <Loader />
      ) : (
        <Container>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Brand Name</th>
                  <th>Product Name</th>
                  <th>Brand Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations && invitations.length ? (
                  invitations.map((invitation: any, index) => (
                    <tr key={invitation.adId}>
                      <td>{index + 1}</td>
                      <td>{invitation.brandName}</td>
                      <td>{invitation.productName}</td>
                      <td>{invitation.brandAddress}</td>
                      <td>
                        {invitation.acceptedStatus ? "Accepted" : "Pending"}
                      </td>
                      <td>
                        {invitation.acceptedStatus ? (
                          "---"
                        ) : (
                          <>
                            <Button
                              variant="success"
                              onClick={() => handleAccept(invitation.adId)}
                              disabled={invitation.acceptedStatus}
                            >
                              Accept
                            </Button>{" "}
                            <Button
                              variant="danger"
                              onClick={() => handleDecline(invitation.adId)}
                              disabled={invitation.acceptedStatus}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
        </Container>
      )}
    </section>
  );
};

export default Invitations;
