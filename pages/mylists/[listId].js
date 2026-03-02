import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/LandingPage/Footer";
import { useStateContext } from "@/context/StateContext";
import { getUserList } from "@/backend/Database";

const tiers = [
  { rank: "S", color: "#f77982" },
  { rank: "A", color: "#f6be7d" },
  { rank: "B", color: "#f5df7c" },
  { rank: "C", color: "#eef57b" },
  { rank: "D", color: "#b0f57d" },
  { rank: "E", color: "#8bf185" },
  { rank: "F", color: "#74eb83" },
];

export default function ListDetailPage() {
  const router = useRouter();
  const { listId } = router.query;
  const { user, authLoading } = useStateContext();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user?.uid || !listId) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserList(user.uid, listId);
        if (alive) setList(data);
      } catch (err) {
        if (alive) setError(err.message || "Failed to load list.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [authLoading, user?.uid, listId]);

  const tierGames = useMemo(() => list?.tierGames || {}, [list]);
  const stagedGames = useMemo(() => list?.stagedGames || [], [list]);

  if (authLoading) return <Centered>Checking session...</Centered>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <Background>
        <Wrap>
          <HeaderRow>
            <Title>{list?.name || "List"}</Title>
            <BackBtn type="button" onClick={() => router.push("/mylists")}>
              Back
            </BackBtn>
          </HeaderRow>

          {loading && <Status>Loading list...</Status>}
          {!loading && error && <ErrorText>{error}</ErrorText>}

          {!loading && !error && list && (
            <>
              <TierBox>
                {tiers.map((tier) => (
                  <TierRow key={tier.rank}>
                    <TierRank $color={tier.color}>{tier.rank}</TierRank>
                    <TierLane>
                      <LaneStrip>
                        {(tierGames[tier.rank] || []).map((game) => (
                          <Cover key={game.id} title={game.name}>
                            {game.coverUrl ? (
                              <CoverImage src={game.coverUrl} alt={game.name} />
                            ) : (
                              <NoCover>{game.name}</NoCover>
                            )}
                          </Cover>
                        ))}
                      </LaneStrip>
                    </TierLane>
                  </TierRow>
                ))}
              </TierBox>

              <StageContainer>
                <StageLabel>Staging Area</StageLabel>
                {stagedGames.length === 0 ? (
                  <Status>No staged games.</Status>
                ) : (
                  <StageStrip>
                    {stagedGames.map((game) => (
                      <Cover key={game.id} title={game.name}>
                        {game.coverUrl ? (
                          <CoverImage src={game.coverUrl} alt={game.name} />
                        ) : (
                          <NoCover>{game.name}</NoCover>
                        )}
                      </Cover>
                    ))}
                  </StageStrip>
                )}
              </StageContainer>
            </>
          )}
        </Wrap>
      </Background>
      <Footer />
    </>
  );
}

const Centered = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
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
  padding: 1rem 0 2rem;
`;

const Wrap = styled.div`
  width: min(1100px, 92vw);
  margin: 0 auto;
  color: white;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.6rem 0 0.8rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0;
`;

const BackBtn = styled.button`
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
`;

const TierBox = styled.div`
  background: rgba(10, 14, 19, 0.84);
  border: 1px solid rgba(190, 211, 228, 0.14);
  border-radius: 12px;
  overflow: hidden;
`;

const TierRow = styled.div`
  min-height: 92px;
  display: grid;
  grid-template-columns: 70px 1fr;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TierRank = styled.div`
  background: ${(p) => p.$color};
  color: #232323;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TierLane = styled.div`
  background: linear-gradient(90deg, #0f1419 0%, #141a21 52%, #10151a 100%);
  display: flex;
  align-items: center;
  padding: 0.35rem 0.5rem;
`;

const LaneStrip = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  width: 100%;
`;

const StageContainer = styled.div`
  margin-top: 0.8rem;
  background: rgba(8, 12, 18, 0.5);
  border: 1px solid rgba(141, 192, 255, 0.16);
  border-radius: 12px;
  padding: 0.8rem;
`;

const StageLabel = styled.h2`
  font-size: 1rem;
  margin: 0 0 0.5rem;
`;

const StageStrip = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
`;

const Cover = styled.div`
  flex: 0 0 auto;
  width: 72px;
  height: 96px;
  border: 1px solid rgba(141, 192, 255, 0.25);
  border-radius: 8px;
  overflow: hidden;
  background: #0f141a;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const NoCover = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 0.3rem;
  font-size: 0.55rem;
  text-align: center;
`;

const Status = styled.p`
  margin: 0.4rem 0;
`;

const ErrorText = styled.p`
  margin: 0.4rem 0;
  color: #f87171;
`;
