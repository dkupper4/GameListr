import React from "react";
import styled from "styled-components";

const steps = [
  {
    step: "01",
    title: "Choose Games",
    text: "Add titles to your staging area before ranking.",
  },
  {
    step: "02",
    title: "Drag Into Tiers",
    text: "Move each game into the S-F row that fits best.",
  },
  {
    step: "03",
    title: "Save And Share",
    text: "Keep your list and compare rankings with friends.",
  },
];

const Info = () => {
  return (
    <InfoSection>
      <InfoContainer>
        <Eyebrow>How It Works</Eyebrow>
        <Title>Build Tier Lists In Minutes</Title>
        <SectionSplit>
          {steps.map((item) => (
            <StepCard key={item.step}>
              <StepTop>
                <StepNumber>{item.step}</StepNumber>
                <StepTitle>{item.title}</StepTitle>
              </StepTop>
              <StepText>{item.text}</StepText>
            </StepCard>
          ))}
        </SectionSplit>
      </InfoContainer>
    </InfoSection>
  );
};

const InfoSection = styled.div`
  background:
    radial-gradient(
      circle at 10% 14%,
      rgba(124, 193, 255, 0.2),
      transparent 34%
    ),
    linear-gradient(90deg, #000 0%, #1a222c 55%, #0f2b47 100%);
  min-height: 30vh;
  width: 100%;
  padding: 2.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  width: min(1100px, 92%);
  background: rgba(8, 12, 18, 0.55);
  border: 1px solid rgba(141, 192, 255, 0.16);
  padding: 1.5rem;
  border-radius: 14px;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.28);
  color: white;
`;

const Eyebrow = styled.p`
  margin: 0 0 0.45rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #8dc0ff;
`;

const Title = styled.h2`
  margin: 0;
  color: #f4f8fd;
  font-family: "Sora", "Avenir Next", sans-serif;
  font-size: clamp(1.45rem, 3vw, 2.15rem);
  line-height: 1.15;
`;

const SectionSplit = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.article`
  min-height: 132px;
  padding: 0.95rem;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(16, 24, 33, 0.95) 0%, #11161b 100%);
  border: 1px solid rgba(141, 192, 255, 0.18);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
  transition:
    transform 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(141, 192, 255, 0.35);
  }
`;

const StepTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const StepNumber = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8dc6ff 0%, #6daefe 100%);
  color: #0b1624;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
`;

const StepTitle = styled.h3`
  margin: 0;
  color: #eef5fd;
  font-family: "Sora", "Avenir Next", sans-serif;
  font-size: 1rem;
`;

const StepText = styled.p`
  margin: 0.75rem 0 0;
  color: #c5d3e1;
  font-size: 0.92rem;
  line-height: 1.45;
`;

export default Info;
