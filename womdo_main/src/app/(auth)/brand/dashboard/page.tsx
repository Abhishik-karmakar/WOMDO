"use client";
import { Container, Row } from "react-bootstrap";
import "./dashboard.scss";
import SmallTitle from "@/components/smalltitle/smalltitle";

const Dashboard = () => {
    return (
        <section className='dashboard_page'>
             <Container>
                <SmallTitle title="Dashboard" className="text-start" />
                <Row>
                    
                </Row>
            </Container>
        </section>
    )
}

export default Dashboard
