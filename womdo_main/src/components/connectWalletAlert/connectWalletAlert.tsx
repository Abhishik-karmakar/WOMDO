import { Card, Col, Container, Row } from "react-bootstrap";
import Button from "../button/button";
import { useWeb3Modal } from "@web3modal/ethers5/react";

function ConnectWalletAlert() {
  const { open } = useWeb3Modal()
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <Row>
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Please Connect Your Wallet</Card.Title>
              <Card.Text>
                To move further, please connect your wallet.
              </Card.Text>
              <Button fluid className='custom_btn' type="submit" onClick={() => open()}>
                  Connect Wallet
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ConnectWalletAlert;
