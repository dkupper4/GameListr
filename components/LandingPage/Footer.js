import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const Footer = () => {
  const [count,setCount] = useState(0)
  let number = 0
  const numb = useRef(0)

  function changeNum(){
    setCount(count + 1)
  }

  function changeNumRef(){
    numb.current ++;
  }

  useEffect(()=>{

  },[numb.current])




  return (
    <FooterSection>
      <FooterContainer>
        <LeftContainer>
          © {new Date().getFullYear()} CMPSC 263
        </LeftContainer>
        <CenterContainer>
          <Link href="#">Privacy Policy</Link> | <Link href="#">Terms of Service</Link>
        </CenterContainer>
        <RightContainer>
          <SocialIcon href="#" aria-label="Facebook">FB</SocialIcon>
          <SocialIcon href="#" aria-label="Twitter">TW</SocialIcon>
          <SocialIcon href="#" aria-label="Instagram">IG</SocialIcon>
        </RightContainer>
      </FooterContainer>
      <ClickButton onClick={changeNumRef}>click me useRef</ClickButton>
      <ClickButton onClick={changeNum}>click me</ClickButton>
      <div>here is the count: {count} here is useRef: {numb.current}</div>
    </FooterSection>
  );
};


const ClickButton = styled.button`
`;

const FooterSection = styled.footer`

`;

const FooterContainer = styled.div`

`;

const LeftContainer = styled.div``;

const CenterContainer = styled.div``;

const RightContainer = styled.div`

`;

const Link = styled.a`

`;

const SocialIcon = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  &:hover {
    color: #007bff;
  }
`;

export default Footer;
