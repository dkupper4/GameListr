import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { logOut } from "@/backend/Auth";
import { useStateContext } from "@/context/StateContext";
const Navbar = () => {
  const { user, setUser, authLoading } = useStateContext();

  return (
    <Nav>
      <Logo href={"/"}>GAMELISTR</Logo>
      <NavLinks>
        <ButtonLink href="/newlist">New List</ButtonLink>
        {!authLoading && !user && (
          <>
            <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
            <ButtonLink href="/auth/login">Login</ButtonLink>
          </>
        )}

        {!authLoading && user && (
          <>
            <ButtonLink href="/mylists">My Lists</ButtonLink>
            <LogoutButton type="button" onClick={() => logOut(setUser)}>
              Logout
            </LogoutButton>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  width: 100%;
  height: 70px;
  padding: 0 2rem;
  background: #000000;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Logo = styled(Link)`
  font-family: "Sora", "Avenir Next", "Trebuchet MS", sans-serif;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1;
  color: #f8fafc;
  text-decoration: none;

  &:hover {
    color: #dae6eb;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  background: #1e293b;
  color: #f1f5f9;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: none;
  background: #1e293b;
  color: #f1f5f9;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
`;

export default Navbar;
