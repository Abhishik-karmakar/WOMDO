"use client";

import ConnectWalletAlert from "@/components/connectWalletAlert/connectWalletAlert";
import SmallTitle from "@/components/smalltitle/smalltitle";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./submitVideo.scss";
import Button from "@/components/button/button";
import { capitalizeFirstLetter } from "@/utils/common.service";
import { API_ROUTES, API_URL, ROUTES } from "@/utils/constants";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/loader/loader";

const SubmitVideo = () => {
  const [loader, setLoader] = useState(false);
  const { address, isConnected } = useWeb3ModalAccount();
  const [invitations, setInvitations]: any = useState([]);
  const router = useRouter();

  const languages = ["english", "hindi"];

  useEffect(() => {
    if (address) handleGetInvitations();
  }, [address]);

  const handleGetInvitations = async () => {
    try {
      const response = await fetch(
        API_URL +
          API_ROUTES.GET_INFLUENCER_INVITATIONS +
          address +
          "?accepted=true",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (data.status) {
        setInvitations(data.data);
      } else if (!data.data.length) {
        toast.error("You don't have any invitation from any brand", {
          id: "toast",
        });
        router.push(ROUTES.INFLUENCER_PROFILE);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      videoId: "",
      language: "",
      productName: "",
    },
    validationSchema: Yup.object({
      videoId: Yup.string().required("Required"),
      language: Yup.string().required("Required"),
      productName: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoader(true);
        const selectedProduct =
          invitations.find(
            (invitation: any) => invitation.adId === values.productName
          )?.productName || "";
        console.log("selectedProduct", selectedProduct);
        let bodyContent = JSON.stringify({
          videoId: values.videoId,
          lang: values.language,
          brand: [selectedProduct],
          influencerAddress: address,
          adId: values.productName,
        });

        console.log("bodyContent", bodyContent);

        let response: any = await fetch(API_URL + API_ROUTES.AI, {
          method: "POST",
          body: bodyContent,
        });
        const data = await response.json();
        if (data.status) {
          toast.success(data.message, { id: "toast" });
          formik.resetForm();
          setLoader(false);
        } else {
          setLoader(false);

          toast.error(data.message, { id: "toast" });
        }
      } catch (error) {
        setLoader(false);

        console.error(error);
      }
    },
  });

  return (
    <section className="video_page">
      {!isConnected ? (
        <ConnectWalletAlert />
      ) : loader ? (
        <Loader />
      ) : (
        <Container>
          <SmallTitle title="Submit Your Video" className="text-start" />
          <Row className="justify-content-md-center">
            <Col md="6" className="mt-5 mb-0">
              <div className="form-container">
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group controlId="videoId" className="form-group">
                    <Form.Label>Youtube Video ID</Form.Label>
                    <Form.Control
                      type="text"
                      {...formik.getFieldProps("videoId")}
                      isInvalid={
                        !!formik.errors.videoId && formik.touched.videoId
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.videoId}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="language" className="form-group">
                    <Form.Label>Video Language</Form.Label>
                    <Form.Control
                      as="select"
                      {...formik.getFieldProps("language")}
                      isInvalid={
                        !!formik.errors.language && formik.touched.language
                      }
                    >
                      <option value="">Select a language</option>
                      {languages.map((language, index) => (
                        <option key={index} value={language}>
                          {capitalizeFirstLetter(language)}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.language}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="productName" className="form-group">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      as="select"
                      {...formik.getFieldProps("productName")}
                      isInvalid={
                        !!formik.errors.productName &&
                        formik.touched.productName
                      }
                    >
                      <option value="">Select a product name</option>
                      {invitations.map((invitation: any, index: any) => (
                        <option key={index} value={invitation.adId}>
                          {invitation.productName}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.language}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button fluid className="custom_btn" type="submit">
                    Submit
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </section>
  );
};

export default SubmitVideo;
