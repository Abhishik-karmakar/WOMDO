import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface ProfileData {
  brandName: string;
  category: string;
}

const ProfilePage: React.FC<ProfileData> = ({ brandName, category }) => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Card style={{borderRadius: '20px'}}>
            <Card.Body>
              <Card.Title>{brandName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
