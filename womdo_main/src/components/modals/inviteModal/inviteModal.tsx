import React, { useEffect, useState } from "react";
import CustomModal from "../modal/modal";
import Button from "@/components/button/button";
import ReactSelect from "react-select";
import { API_ROUTES, API_URL, ROUTES } from "@/utils/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type TProps = {
  influencerAddress: string
  show: boolean;
  handleClose: () => void;
};

const InviteModal = (props: TProps) => {
  const router = useRouter();
  const [options, setOptions]: any = useState([{}]);
  const [adId, setAdId]: any = useState("");

  const { address, isConnected } = useWeb3ModalAccount();
  useEffect(() => {
    handleCheckUserIsValid();
  }, [props.show]);

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
        const optionss = data.data[0].ads.map(
          (ad: { productName: any; adId: any }) => ({
            label: ad.productName,
            value: ad.adId,
          })
        );
        // You can use the options array as needed, e.g., set it to state
        setOptions(optionss);
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

  const handleInvite = async () => {
    if (!isConnected) {
      toast.error("Please connect wallet!", { id: "toast" });
      return;
    }
    let headersList = {
      "Content-Type": "application/json",
    };
    let bodyContent = JSON.stringify({
      adId: adId,
      influencerAddress: props.influencerAddress,
    });

    let response: any = await fetch(API_URL + API_ROUTES.BRAND_SEND_REQUEST, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    const data = await response.json();
    console.log("data", data);
    if (data.status) {
      toast.success(data.message, { id: "toast" });
      props.handleClose()
    } else {
      toast.error(data.message, { id: "toast" });
    }
  };
  return (
    <CustomModal
      className="invite_modal"
      show={props.show}
      handleClose={props.handleClose}
      title=" "
    >
      <div className="invite_in">
        <div className="invite_content">
          <h2>Invite influencer to promote your Ad</h2>
          <form onClick={(e) => e.preventDefault()}>
            {/* <label htmlFor="amount">Select Ad</label> */}
            <div className="input">
              <ReactSelect
                classNamePrefix={"select"}
                formatOptionLabel={(option: any) => {
                  return <div className="token_option">{option.label}</div>;
                }}
                options={options}
                onChange={(e) => setAdId(e.value)}
                placeholder="Select Ad"
              />
            </div>
            <Button type="submit" className="mt-3" fluid onClick={handleInvite}>
              Invite
            </Button>
          </form>
        </div>
      </div>
    </CustomModal>
  );
};

export default InviteModal;
