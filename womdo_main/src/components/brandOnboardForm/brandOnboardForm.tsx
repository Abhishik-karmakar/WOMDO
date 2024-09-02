// components/BrandOnboardForm.tsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Container, Row, Col } from "react-bootstrap";
import "./brandOnboardForm.scss";
import Button from "../button/button";
import { API_ROUTES, API_URL } from "@/utils/constants";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import toast from "react-hot-toast";

interface FormValues {
  brandName: string;
  category: string;
}
interface BrandOnboardFormProps {
  handleRefresh: () => void;
}

const BrandOnboardForm: React.FC<BrandOnboardFormProps> = ({
  handleRefresh,
}) => {
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
      brandName: "",
      category: "",
    },
    validationSchema: Yup.object({
      brandName: Yup.string().required("Brand name is required"),
      category: Yup.string().required("Category is required"),
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
        brandName: values.brandName,
        category: values.category,
        brandAddress: address,
      });

      let response: any = await fetch(API_URL + API_ROUTES.GET_BRAND, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });
      const data = await response.json();
      if (data.status) {
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
              <Form.Group controlId="brandName" className="form-group">
                <Form.Label>Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("brandName")}
                  isInvalid={
                    !!formik.errors.brandName && formik.touched.brandName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.brandName}
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

export default BrandOnboardForm;
