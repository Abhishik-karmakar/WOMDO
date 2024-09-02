import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Container, Row, Col } from "react-bootstrap";
import "./adOnboardForm.scss";
import Button from "../button/button";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import WomdoAbi from "../../app/(auth)/abi/Womdo.json";
import UsdtAbi from "../../app/(auth)/abi/TetherUSD.json";
import toast from "react-hot-toast";
import { UsdtAddress, WomdoAddress } from "@/utils/constants";
import { getError } from "@/utils/common.service";
import Loader from "../loader/loader";
import SmallTitle from "../smalltitle/smalltitle";

interface FormValues {
  productName: string;
  amount: string;
  noOfInfluencers: string;
}

const AdOnboardForm: React.FC = () => {
  const [loader, setLoader] = useState(false);
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider }: any = useWeb3ModalProvider();

  const formik = useFormik<FormValues>({
    initialValues: {
      productName: "",
      amount: "",
      noOfInfluencers: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Brand Name is required"),
      amount: Yup.string().required("Budget is required"),
      noOfInfluencers: Yup.string().required(
        "Number of Influencers is required"
      ),
    }),
    onSubmit: async (values) => {
      // Handle form submission

      if (!isConnected) {
        toast.error("Please connect wallet!");
        return;
      }

      try {
        setLoader(true);
        const ethersProvider = new ethers.providers.Web3Provider(
          walletProvider
        );
        const signer = ethersProvider.getSigner();
        // The Contract object
        const UsdtContract = new ethers.Contract(UsdtAddress, UsdtAbi, signer);
        const decimal = await UsdtContract.decimals();
        const amount = ethers.utils.parseUnits(values.amount, decimal);
        const allowance = await UsdtContract.allowance(address, WomdoAddress);
        if (amount.gt(allowance)) {
          const approval = await UsdtContract.approve(WomdoAddress, amount);
          const reciept = await approval.wait(1);
          if (!reciept) {
            toast.error("Approval failed", { id: "toast" });
            return;
          }
        }
        const WomdoContract = new ethers.Contract(
          WomdoAddress,
          WomdoAbi,
          signer
        );
        console.log("WomdoContract", WomdoContract);
        const registerAd = await WomdoContract.registerAd(
          values.noOfInfluencers,
          amount,
          values.productName
        );
        const reciept = await registerAd.wait(1);
        if (!reciept) {
          toast.error("Register Ad failed", { id: "toast" });
          return;
        }
        formik.resetForm();
        setLoader(false);
        toast.success("Ad registered successfully!", { id: "toast" });
      } catch (error: any) {
        setLoader(false);
        toast.error(getError(error), { id: "toast" });
      }
    },
  });
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <Container>
          <Row className="justify-content-md-center">
            <Col md="6" className="mt-5 mb-0">
              <SmallTitle title="Create Ad" className="text-start mb-0" />
              <div className="form-container">
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group controlId="productName" className="form-group">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("productName")}
                      isInvalid={
                        !!formik.errors.productName && formik.touched.productName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.productName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="amount" className="form-group">
                    <Form.Label>Budget</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("amount")}
                      isInvalid={
                        !!formik.errors.amount && formik.touched.amount
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.amount}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    controlId="noOfInfluencers"
                    className="form-group"
                  >
                    <Form.Label>Number of Influencers</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("noOfInfluencers")}
                      isInvalid={
                        !!formik.errors.noOfInfluencers &&
                        formik.touched.noOfInfluencers
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.noOfInfluencers}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="form-button">
                    <Button fluid className="custom_btn" type="submit">
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default AdOnboardForm;
