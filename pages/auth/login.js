import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import { login, isEmailInUse } from "@/backend/Auth";
import Link from "next/link";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/LandingPage/Footer";

const Login = () => {
  const { user, setUser } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleLogin() {}

  return (
    <>
      <Navbar />
      <Background>
        <LoginContainer>
          <Header>Login</Header>
          <InputTitle>Email</InputTitle>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputTitle>Password</InputTitle>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <UserAgreementText>
            By signing in, you automatically agree to our{" "}
            <UserAgreementSpan
              href="/legal/terms-of-use"
              rel="noopener noreferrer"
              target="_blank"
            >
              {" "}
              Terms of Use
            </UserAgreementSpan>{" "}
            and{" "}
            <UserAgreementSpan
              href="/legal/privacy-policy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy.
            </UserAgreementSpan>
          </UserAgreementText>

          <MainButton onClick={handleLogin}>Login</MainButton>
        </LoginContainer>
      </Background>
      <Footer></Footer>
    </>
  );
};

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
  justify-content: center;
  align-items: flex-start;
  padding-top: 10rem;
`;

const LoginContainer = styled.div`
  width: min(420px, 92vw);
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
`;

const Header = styled.h1`
  font-size: 1.8rem; /* Adjusted for better scalability */
  margin: 0 0 0.4rem;
`;

const Input = styled.input`
  height: 40px;
  padding: 0 0 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(141, 192, 255, 0.24);
  font-size: 1rem;
  padding: 0.5rem;
`;

const InputTitle = styled.label`
  font-size: 14px;
  padding: 0.5rem;
`;

const MainButton = styled.button`
  background-color: #8dc0ff;
  font-size: 16px;
  border-radius: 10px;
  height: 40px;
  border: none;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

const UserAgreementText = styled.p`
  font-size: 12px;
  margin: 0.3rem 0.3rem 0.3rem;
`;

const UserAgreementSpan = styled(Link)`
  color: #007bff;
`;

export default Login;
