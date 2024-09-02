import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

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

const ProfilePage: React.FC<ProfileData> = ({
  name,
  channelName,
  totalViewCount,
  subscribers,
  overallWatchtime,
  category,
  wallet,
  channelLink,
  email,
}) => {
  return (
    <Container>
      <Row>
        <Col>
          <Card style={{ borderRadius: '20px' }}>
            <Card.Body>
              <Card.Title>{channelName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Category: {category}</Card.Subtitle>
              <Card.Text>
                <strong>Name:</strong> {name}
                <br />
                <strong>Email:</strong> {email}
                <br />
                <strong>Channel Link:</strong> <a href={channelLink} target="_blank" rel="noopener noreferrer">{channelLink}</a>
                <br />
                <strong>Subscribers:</strong> {subscribers}
                <br />
                <strong>Total View Count:</strong> {totalViewCount}
                <br />
                <strong>Overall Watchtime:</strong> {overallWatchtime}
                <br />
                <strong>Wallet Address:</strong> {wallet}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
