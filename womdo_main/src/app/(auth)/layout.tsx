"use client";
import Button from '@/components/button/button';
import Sidebar from '@/components/sidebar/sidebar';
import { ROUTES } from '@/utils/constants';
import { LazyMotion, domMax } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import "./authlayout.scss";
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { custmizeAddress } from '@/utils/common.service';
import Loader from '@/components/loader/loader';

type TProps = {
    children: ReactNode,
}

const layout = (props: TProps) => {
    const [active, setActive] = useState(false);
    const [loader, setLoader] = useState(true);
    const handleClick = () => document.body.clientWidth < 991 && setActive(!active);
    const { open } = useWeb3Modal()
    const { address, isConnected} = useWeb3ModalAccount()
    useEffect(() => {
        setLoader(false) 
    }, [isConnected])
    return (
        <main className='auth_layout'>
            <LazyMotion strict features={domMax}>
                <Sidebar active={active} handleClick={handleClick} />
                <div className="auth_in">
                    <header className="auth_header">
                        <Container>
                            <div className="auth_header_in">
                                <Link
                                    href={ROUTES.HOME}
                                    className="d-lg-none auth_header_logo"
                                >
                                    WOMDO
                                </Link>
                                <Button className='ms-auto connect_btn' onClick={() => open()}>{isConnected ? custmizeAddress (address as string) : 'Connect Wallet'}</Button>
                                <button
                                    className={`header_toggle d-lg-none ${active ? "active" : ""}`}
                                    onClick={handleClick}
                                >
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                            </div>
                        </Container>
                    </header>
                    {loader ? <Loader/> : props.children}
                </div>
            </LazyMotion>
        </main>
    )
}

export default layout
