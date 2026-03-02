import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import Navbar from "@/components/Dashboard/Navbar";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/router";
import Footer from "@/components/LandingPage/Footer";
import { getUserLists } from "@/backend/Database";
import { deleteUserList } from "@/backend/Database";

const MyLists = () => {
  const { user, authLoading } = useStateContext();
  const router = useRouter();

  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  const [listsError, SetListsError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(listId) {
    if (!confirm("Delete this list?")) return;
    try {
      setDeletingId(listId);
      await deleteUserList(user.uid, listId);
      setLists((prev) => prev.filter((l) => l.id !== listId));
    } catch (err) {
      SetListsError(err.message || "Failed to delete list");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.uid) return;

    let alive = true;
    (async () => {
      try {
        setListsLoading(true);
        SetListsError("");
        const data = await getUserLists(user.uid);
        if (alive) setLists(data);
      } catch (err) {
        if (alive) SetListsError(err.message || "Failed to load");
      } finally {
        if (alive) setListsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?.uid]);

  if (authLoading) return <Section>Checking session...</Section>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Background>
        <TopHeader>{user.email}'s Lists</TopHeader>
        <ListContainer>
          {listsLoading && <StatusText>Loading your lists...</StatusText>}
          {!listsLoading && listsError && <ErrorText>{listsError}</ErrorText>}
          {!listsLoading && !listsError && lists.length === 0 && (
            <StatusText>No saved lists yet.</StatusText>
          )}

          {!listsLoading && !listsError && lists.length > 0 && (
            <CardsList>
              {lists.map((list) => {
                const tierCount = Object.values(list.tierGames || {}).reduce(
                  (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
                  0,
                );
                const stagedCount = Array.isArray(list.stagedGames)
                  ? list.stagedGames.length
                  : 0;

                return (
                  <ListCard key={list.id}>
                    <CardActions>
                      <ViewBtn href={`/mylists/${list.id}`}>View</ViewBtn>
                      <DeleteBtn
                        type="button"
                        onClick={() => handleDelete(list.id)}
                        disabled={deletingId === list.id}
                      >
                        {deletingId === list.id ? "Deleting..." : "Delete"}
                      </DeleteBtn>
                    </CardActions>
                    <CardTitle>{list.name || "Untitled List"}</CardTitle>
                    <CardMeta>Tiered games: {tierCount}</CardMeta>
                    <CardMeta>Staging: {stagedCount}</CardMeta>
                    <CardMeta>
                      Updated:{" "}
                      {list.updatedAt?.toDate
                        ? list.updatedAt.toDate().toLocaleString()
                        : "Just now"}
                    </CardMeta>
                  </ListCard>
                );
              })}
            </CardsList>
          )}
        </ListContainer>
      </Background>
      <Footer />
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
  color: white;
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
  align-items: center;
`;

const ListContainer = styled.div`
  margin: 1rem 0;
  width: min(1100px, 92vw);
  min-height: 60vh;
  background: rgba(8, 12, 18, 0.5);
  border: 1px solid rgba(141, 192, 255, 0.16);
  padding: 1.2rem;
  border-radius: 14px;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.28);
  color: white;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
`;

const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ListCard = styled.div`
  width: 100%;
  background: #111827;
  border: 1px solid rgba(141, 192, 255, 0.22);
  border-radius: 10px;
  padding: 0.8rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.45rem;
`;

const CardMeta = styled.p`
  margin: 0.2rem 0;
  font-size: 0.9rem;
`;

const StatusText = styled.p`
  margin: 0.4rem 0;
`;

const ErrorText = styled.p`
  margin: 0.4rem 0;
  color: #f87171;
`;
const CardActions = styled.div`
  margin-top: 0.7rem;
  display: flex;
  gap: 0.5rem;
`;

const ViewBtn = styled(Link)`
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  background: #8dc6ff;
  color: #0b1624;
  text-decoration: none;
  font-weight: 700;
`;

const DeleteBtn = styled.button`
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

export default MyLists;
