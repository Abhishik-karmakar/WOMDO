import { bubblegumSans } from "@/fonts/fonts";
import type { Metadata } from "next";
import Head from "next/head";
import "./index.scss";
import { Web3Modal } from "@/context/web3modal";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "WOMDO",
  description: "Enhancing Brands with AI-Driven, Decentralized Influencer Marketing Solutions.",
  keywords: "AI, Decentralized, Marketing, Brand, Influencers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bubblegumSans.variable}`}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <body>
        <Web3Modal>
          <Toaster position="top-center" />
          {/* <Loader /> */}
          {children}
        </Web3Modal>
      </body>
    </html>
  );
}
