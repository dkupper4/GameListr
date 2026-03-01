import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/LandingPage/Footer";

const tiers = [
  { rank: "S", color: "#f77982" },
  { rank: "A", color: "#f6be7d" },
  { rank: "B", color: "#f5df7c" },
  { rank: "C", color: "#eef57b" },
  { rank: "D", color: "#b0f57d" },
  { rank: "E", color: "#8bf185" },
  { rank: "F", color: "#74eb83" },
];

export default function NewList() {
  return (
    <>
      <Navbar />
      <Background>
        <TierBox>
          {tiers.map((tier) => (
            <TierRow key={tier.rank}>
              <TierRank $color={tier.color}>{tier.rank}</TierRank>
              <TierLane />
            </TierRow>
          ))}
        </TierBox>
        <StageContainer>
          <StageText>Click to Add Games to Staging Area</StageText>
        </StageContainer>
      </Background>
      <Footer />
    </>
  );
}

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

const TierBox = styled.div`
  width: min(1100px, 92vw);
  height: 60vh;
  display: flex;
  flex-direction: column;
  background: rgba(10, 14, 19, 0.84);
  border: 1px solid rgba(190, 211, 228, 0.14);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 950px) {
    width: 100%;
    justify-self: stretch;
  }
`;

const TierRow = styled.div`
  flex: 1;
  display: grid;
  min-height: 0;
  grid-template-columns: 100px 1fr;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TierRank = styled.div`
  background: ${(props) => props.$color};
  color: #232323;
  font-weight: 700;
  font-size: 1.12rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TierLane = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
  background: linear-gradient(90deg, #0f1419 0%, #141a21 52%, #10151a 100%);
`;

const StageContainer = styled.div`
  margin: 1rem 0 1rem;
  width: min(1100px, 92vw);
  height: 20vh;
  background: rgba(8, 12, 18, 0.5);
  border: 1px solid rgba(141, 192, 255, 0.16);
  padding: 1.6rem;
  border-radius: 14px;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.28);
  color: white;
  display: flex;
  gap: 0.6rem;
  flex-direction: column;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  justify-content: center;
`;

const StageText = styled.h1`
  font-size: 1.8rem;
  text-align: center;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;
