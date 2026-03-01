import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import Navbar from "@/components/Dashboard/Navbar";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/router";
import Footer from "@/components/LandingPage/Footer";

const MyLists = () => {
  const { user, authLoading } = useStateContext();

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  if (authLoading) return <Section>Checking session...</Section>;
  if (!user) return null;

  if (authLoading) {
    return (
      <>
        <Navbar></Navbar>
        <Background>
          <TopHeader>Welcome {user?.email} </TopHeader>
        </Background>
        <Footer></Footer>
      </>
    );
  }
  return (
    <>
      <Navbar></Navbar>
      <Background>
        <TopHeader>Welcome {user?.email} </TopHeader>
      </Background>
      <Footer></Footer>
    </>
  );
};

//STYLED COMPONENTS
const Section = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const TopHeader = styled.h1`
  font-size: 26px;
  display: flex;
`;

const Background = styled.div`
  background:
    radial-gradient(
      circle at 10% 14%,
      rgba(124, 193, 255, 0.2),
      transparent 34%
    ),
    linear-gradient(90deg, #000 0%, #1a222c 55%, #0f2b47 100%);
  min-height: 90vh;
  width: 100%;
  padding: 2.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0.5rem;
  align-items: center;
`;

export default MyLists;
