import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterSection>
      <FooterContainer>
        <LeftContainer>
          <Brand>GAMELISTR</Brand>
          <Copyright>(c) {new Date().getFullYear()} Dylan Kupper</Copyright>
        </LeftContainer>

        <CenterContainer>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <Divider aria-hidden="true">|</Divider>
          <FooterLink href="#">Terms of Service</FooterLink>
        </CenterContainer>

        <RightContainer>
          <SocialIcon href="#" aria-label="Facebook">
            FB
          </SocialIcon>
          <SocialIcon href="#" aria-label="Twitter">
            TW
          </SocialIcon>
          <SocialIcon href="#" aria-label="Instagram">
            IG
          </SocialIcon>
        </RightContainer>
      </FooterContainer>
    </FooterSection>
  );
};

const FooterSection = styled.footer`
  width: 100%;
  background:
    radial-gradient(circle at 84% 8%, rgba(76, 148, 229, 0.16), transparent 34%),
    linear-gradient(180deg, #070a0f 0%, #0c1219 100%);
  color: #e7eef6;
  border-top: 1px solid rgba(167, 193, 217, 0.16);
`;

const FooterContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 1.35rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 1rem 1.5rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Brand = styled.span`
  font-family: "Sora", "Avenir Next", "Trebuchet MS", sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f4f8fd;
`;

const Copyright = styled.span`
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  font-size: 0.8rem;
  color: #a7bbd0;
`;

const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
`;

const FooterLink = styled.a`
  color: #d7e4f1;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.18s ease;

  &:hover {
    color: #8dc0ff;
  }
`;

const Divider = styled.span`
  color: #6f87a0;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(160, 186, 212, 0.2);
  background: rgba(17, 26, 35, 0.88);
  color: #e9f2fb;
  text-decoration: none;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    color: #8dc0ff;
    border-color: rgba(141, 192, 255, 0.5);
  }
`;

export default Footer;
