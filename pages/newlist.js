import React, { useEffect, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stagedGames, SetStagedGames] = useState([]);
  const coverResults = results.filter((g) => g.coverUrl).slice(0, 10);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "search failed");
        setResults(j.games || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query]);

  function addToStaging(game) {
    SetStagedGames((prev) =>
      prev.some((g) => g.id === game.id) ? prev : [...prev, game],
    );
  }

  function removeFromStaging(gameId) {
    SetStagedGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  return (
    <>
      <Navbar />
      <Background>
        <SearchWrap>
          <SearchInput
            placeholder="Search for a game"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <StatusText>Searching...</StatusText>}
          {error && <ErrorText>{error}</ErrorText>}

          {coverResults.length > 0 && (
            <CoverStrip>
              {coverResults.map((game) => (
                <CoverButton
                  key={game.id}
                  type="button"
                  title={game.name}
                  onClick={() => addToStaging(game)}
                >
                  <CoverImage src={game.coverUrl} alt={game.name} />
                </CoverButton>
              ))}
            </CoverStrip>
          )}
        </SearchWrap>
        <TierBox>
          {tiers.map((tier) => (
            <TierRow key={tier.rank}>
              <TierRank $color={tier.color}>{tier.rank}</TierRank>
              <TierLane />
            </TierRow>
          ))}
        </TierBox>
        <StageContainer>
          {stagedGames.length === 0 ? (
            <StageText>Add Games to Staging Area</StageText>
          ) : (
            <StageStrip>
              {stagedGames.map((game) => (
                <StageCover key={game.id} title={game.name}>
                  <RemoveBtn
                    type="button"
                    onClick={() => removeFromStaging(game.id)}
                  >
                    X
                  </RemoveBtn>
                  <CoverImage src={game.coverUrl} alt={game.name} />
                </StageCover>
              ))}
            </StageStrip>
          )}
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
  height: 15vh;
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

const SearchWrap = styled.div`
  width: min(1100px, 92vw);
  margin: 0 0 1rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 0.8rem;
  border-radius: 8px;
  border: 1px solid;
  background: #10161d;
  color: white;
`;
const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.6rem;
`;
const ResultCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #10161d;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  color: #fff;
`;
const AddBtn = styled.button`
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
`;
const StatusText = styled.p`
  color: #cbd5e1;
  margin-top: 0.4rem;
`;
const ErrorText = styled.p`
  color: #f87171;
  margin-top: 0.4rem;
`;

const CoverStrip = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.6rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const CoverButton = styled.button`
  flex: 0 0 auto;
  width: 96px;
  height: 128px;
  padding: 0;
  border: 1px solid rgba(141, 192, 255, 0.25);
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const StageStrip = styled.div`
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
`;

const StageCover = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: 92px;
  height: 122px;
  border: 1px solid rgba(141, 192, 255, 0.25);
  border-radius: 8px;
  overflow: hidden;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
`;
