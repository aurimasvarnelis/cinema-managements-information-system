import { Card, Carousel, Container } from "react-bootstrap";

import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";

export default function Home() {
	// const card1 = require('./images/lalaland-slider.jpg');
	// const card2 = require('./images/batman-slider.jpg');
	return (
		<>
			{/* <Container className="home-carousel">
      <Carousel>
        <Carousel.Item interval={100000}>
          <Image
            className="d-block w-100"
            src="/lalaland-slider.jpg"
            alt="First slide"
            width="1280px"
            height="720px"
            layout="responsive" 
          />
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        
        <Carousel.Item interval={100000}>
          <Image
            className="d-block w-100"
            src="/batman-slider.jpg"
            alt="Second slide"
            width="1280px"
            height="720px"
          />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        
        
      </Carousel>
    </Container> */}
		</>
	);
}
