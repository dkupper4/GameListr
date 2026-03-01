import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import { isEmailInUse, register } from "@/backend/Auth";
import Link from "next/link";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/LandingPage/Footer";

const Signup = () => {
  const { user, setUser } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function validateEmail() {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email) == false) {
      return false;
    }
    console.log("so far so good...");
    const emailInUse = await isEmailInUse(email);
    if (emailInUse) return false;

    return true;
  }

  async function handleSignup() {
    const isValidEmail = await validateEmail();
    console.log("isValidEmail", isValidEmail);
    if (!isValidEmail) {
      return;
    }

    try {
      await register(email, password, setUser);
      router.push("/");
    } catch (err) {
      console.log("Error Signing Up", err);
    }
  }

  return (
    <>
      <Navbar />
      <Background>
        <SignupContainer>
          <Header>Signup</Header>
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
            By signing up, you automatically agree to our{" "}
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

          <MainButton onClick={handleSignup}>Signup</MainButton>
        </SignupContainer>
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

const SignupContainer = styled.div`
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
  /* Changed to label for semantics */
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
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  margin: 0.3rem 0.3rem 0.3rem;
`;

const UserAgreementSpan = styled(Link)`
  color: #007bff;
`;

export default Signup;
