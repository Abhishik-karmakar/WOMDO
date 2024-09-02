"use client";
import Footer from '@/components/footer/footer';
import { LazyMotion, domMax } from 'framer-motion';
import "./homepage.scss";
import Banner from '@/components/landingpage/banner/banner';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';


const Homepage = () => {
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
    }, [])
    return (
        <>
            <LazyMotion strict features={domMax}>
                <main className="homepage">
                    <Banner />
                    <Footer />
                </main>
            </LazyMotion>
        </>
    )
}

export default Homepage
