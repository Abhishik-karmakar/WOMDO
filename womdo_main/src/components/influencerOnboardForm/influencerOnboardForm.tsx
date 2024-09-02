// components/BrandOnboardForm.tsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Container, Row, Col } from "react-bootstrap";
import "./influencerOnboardForm.scss";
import Button from "../button/button";
import { API_ROUTES, API_URL } from "@/utils/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  channelName: string;
  category: string;
  email: string;
  channelLink: string;
  subscribers: string;
  totalViewCount: string;
  overallWatchtime: string;
}

interface InfluencerOnboardFormProps {
  handleRefresh: () => void;
}


const InfluencerOnboardForm: React.FC<InfluencerOnboardFormProps> = ({ handleRefresh }) => {
  const { address, isConnected } = useWeb3ModalAccount();

  const categories = [
    "Music",
    "Lifestyle",
    "Education",
    "Sports",
    "Gaming",
    "News",
    "Comedy",
    "Entertainment",
    "Film & Animation",
    "Science & Technology",
    "Travel & Events",
  ];
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      channelName: "",
      category: "",
      email: "",
      channelLink: "",
      subscribers: "",
      totalViewCount: "",
      overallWatchtime: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      channelName: Yup.string().required("Channel Name is required"),
      category: Yup.string().required("Category is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      channelLink: Yup.string()
        .url("Invalid URL")
        .required("Channel link is required"),
      subscribers: Yup.string().required("Subscribers is required"),
      totalViewCount: Yup.string().required("Total view count is required"),
      overallWatchtime: Yup.string().required("Overall watch time is required"),
    }),
    onSubmit: async (values) => {
      if (!isConnected) {
        toast.error("Please connect wallet!", { id: "toast" });
        return;
      }
      let headersList = {
        "Content-Type": "application/json",
      };
      let bodyContent = JSON.stringify({
        name: values.name,
        channelName: values.channelName,
        totalViewCount: values.totalViewCount,
        subscribers: values.subscribers,
        overallWatchtime: values.overallWatchtime,
        category: values.category,
        wallet: address,
        channelLink: values.channelLink,
        email: values.email
      });

      let response : any= await fetch(API_URL + API_ROUTES.GET_INFLUENCER, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });
      const data = await response.json()
      console.log('data', data)
      if(data.status){
        toast.success(data.message, { id: "toast" });
        handleRefresh();
      } else {
        toast.error(data.message, { id: "toast" });
      }
    },
  });

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <div className="form-container">
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group controlId="name" className="form-group">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("name")}
                  isInvalid={!!formik.errors.name && formik.touched.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="channelName" className="form-group">
                <Form.Label>Channel Name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("channelName")}
                  isInvalid={
                    !!formik.errors.channelName && formik.touched.channelName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.channelName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="category" className="form-group">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  {...formik.getFieldProps("category")}
                  isInvalid={
                    !!formik.errors.category && formik.touched.category
                  }
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.category}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email" className="form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...formik.getFieldProps("email")}
                  isInvalid={!!formik.errors.email && formik.touched.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="channelLink" className="form-group">
                <Form.Label>Channel Link</Form.Label>
                <Form.Control
                  type="url"
                  {...formik.getFieldProps("channelLink")}
                  isInvalid={
                    !!formik.errors.channelLink && formik.touched.channelLink
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.channelLink}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="subscribers" className="form-group">
                <Form.Label>Subscribers</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("subscribers")}
                  isInvalid={
                    !!formik.errors.subscribers && formik.touched.subscribers
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.subscribers}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="totalViewCount" className="form-group">
                <Form.Label>Total View Count</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("totalViewCount")}
                  isInvalid={
                    !!formik.errors.totalViewCount &&
                    formik.touched.totalViewCount
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.subscribers}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="overallWatchtime" className="form-group">
                <Form.Label>Overall Watch Time (in hours)</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("overallWatchtime")}
                  isInvalid={
                    !!formik.errors.overallWatchtime &&
                    formik.touched.overallWatchtime
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.overallWatchtime}
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
  );
};

export default InfluencerOnboardForm;
