import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useStateContext } from "@/context/StateContext";
import Navbar from "@/components/Dashboard/Navbar";
import Footer from "@/components/LandingPage/Footer";
import { saveUserList } from "@/backend/Database";

const tiers = [
  { rank: "S", color: "#f77982" },
  { rank: "A", color: "#f6be7d" },
  { rank: "B", color: "#f5df7c" },
  { rank: "C", color: "#eef57b" },
  { rank: "D", color: "#b0f57d" },
  { rank: "F", color: "#74eb83" },
];

const CONTENT_WIDTH = "min(1100px, 92vw)";
const TIER_LABEL_WIDTH = "clamp(46px, min(8vw, 8vh), 96px)";
const GAME_CARD_WIDTH = "clamp(40px, min(6.8vw, 7vh), 84px)";
const GAME_CARD_HEIGHT = `calc((${GAME_CARD_WIDTH}) * 4 / 3)`;
const GAME_CARD_GAP = "clamp(0.25rem, min(0.8vw, 0.8vh), 0.6rem)";
const TIER_VERTICAL_PADDING = "clamp(0.22rem, min(0.55vw, 0.6vh), 0.55rem)";
const STAGE_VERTICAL_PADDING = "clamp(0.75rem, min(1.4vw, 1.6vh), 1rem)";
const TIER_ROW_MIN_HEIGHT = `calc(${GAME_CARD_HEIGHT} + (${TIER_VERTICAL_PADDING} * 2))`;
const STAGE_MIN_HEIGHT = `calc(${GAME_CARD_HEIGHT} + (${STAGE_VERTICAL_PADDING} * 2) + 1.5rem)`;

export default function NewList() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stagedGames, setStagedGames] = useState([]);

  const [tierGames, setTierGames] = useState(() =>
    Object.fromEntries(tiers.map((t) => [t.rank, []])),
  );
  const [dragItem, setDragItem] = useState(null);
  const onDragOver = (e) => e.preventDefault();
  const coverResults = results.filter((g) => g.coverUrl).slice(0, 10);

  const [selectedGame, setSelectedGame] = useState(null);

  const { user, authLoading } = useStateContext();

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [showSaveModal, SetShowSaveModal] = useState(false);
  const [listname, setListname] = useState("");

  const [hltb, setHltb] = useState(null);
  const [hltbLoading, setHltbLoading] = useState(false);
  const [hltbError, setHltbError] = useState("");

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
    setStagedGames((prev) =>
      prev.some((g) => g.id === game.id) ? prev : [...prev, game],
    );
  }

  function removeFromStaging(gameId) {
    setStagedGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  async function getGameInfo(game) {
    setSelectedGame(game);
    setHltb(null);
    setHltbError("");
    setHltbLoading(true);
    try {
      const r = await fetch(`/api/hltb?q=${encodeURIComponent(game.name)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to load from HLTB");
      setHltb(j.hltb);
    } catch (e) {
      setHltbError(e.message);
    } finally {
      setHltbLoading(false);
    }
  }

  function closeGameInfo(game) {
    setSelectedGame(null);
  }

  function stripFromAllTiers(prev, gameId) {
    const next = {};
    for (const rank of Object.keys(prev)) {
      next[rank] = prev[rank].filter((g) => g.id !== gameId);
    }
    return next;
  }

  function onDragStart(game, from) {
    setDragItem({ game, from });
  }

  function dropToTier(rank) {
    if (!dragItem) return;
    const { game } = dragItem;

    setStagedGames((prev) => prev.filter((g) => g.id !== game.id));
    setTierGames((prev) => {
      const next = stripFromAllTiers(prev, game.id);
      next[rank] = [...next[rank], game];
      return next;
    });

    setDragItem(null);
  }

  function dropToStage() {
    if (!dragItem) return;
    const { game } = dragItem;
    setTierGames((prev) => stripFromAllTiers(prev, game.id));
    setStagedGames((prev) =>
      prev.some((g) => g.id === game.id) ? prev : [...prev, game],
    );

    setDragItem(null);
  }

  async function handleSaveList() {
    try {
      setSaveLoading(true);
      setSaveError("");
      const cleanTierGames = Object.fromEntries(
        Object.entries(tierGames).map(([rank, games]) => [
          rank,
          games.map((g) => ({
            id: g.id,
            name: g.name,
            coverUrl: g.coverUrl ?? null,
            releaseDate: g.releaseDate ?? null,
            rating: g.rating ?? null,
            genres: g.genres ?? [],
            platforms: g.platforms ?? [],
          })),
        ]),
      );

      const cleanStagedGames = stagedGames.map((g) => ({
        id: g.id,
        name: g.name,
        coverUrl: g.coverUrl ?? null,
        releaseDate: g.releaseDate ?? null,
        rating: g.rating ?? null,
        genres: g.genres ?? [],
        platforms: g.platforms ?? [],
      }));

      await saveUserList({
        uid: user.uid,
        name: listname,
        tierGames: cleanTierGames,
        stagedGames: cleanStagedGames,
      });

      SetShowSaveModal(false);
      setListname("");
    } catch (err) {
      setSaveError(err.message || "Failed to save list");
    } finally {
      setSaveLoading(false);
    }
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
        <BoardViewport>
          <BoardStack>
            <TierBox>
              {tiers.map((tier) => (
                <TierRow key={tier.rank}>
                  <TierRank $color={tier.color}>{tier.rank}</TierRank>
                  <TierLane
                    onDragOver={onDragOver}
                    onDrop={() => dropToTier(tier.rank)}
                  >
                    <LaneStrip>
                      {tierGames[tier.rank].map((game) => (
                        <TierCover
                          key={game.id}
                          title={game.name}
                          draggable
                          onDragStart={() =>
                            onDragStart(game, { type: "tier", rank: tier.rank })
                          }
                          onDragEnd={() => setDragItem(null)}
                        >
                          <RemoveBtn
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTierGames((prev) => ({
                                ...prev,
                                [tier.rank]: prev[tier.rank].filter(
                                  (g) => g.id !== game.id,
                                ),
                              }));
                            }}
                          >
                            X
                          </RemoveBtn>
                          <InfoBtn
                            type="button"
                            onClick={() => getGameInfo(game)}
                          >
                            I
                          </InfoBtn>
                          <CoverImage src={game.coverUrl} alt={game.name} />
                        </TierCover>
                      ))}
                    </LaneStrip>
                  </TierLane>
                </TierRow>
              ))}
            </TierBox>
            <StageContainer onDragOver={onDragOver} onDrop={dropToStage}>
              {stagedGames.length === 0 ? (
                <StageText>Add Games to Staging Area</StageText>
              ) : (
                <StageStrip>
                  {stagedGames.map((game) => (
                    <StageCover
                      key={game.id}
                      title={game.name}
                      draggable
                      onDragStart={() => onDragStart(game, { type: "stage" })}
                      onDragEnd={() => setDragItem(null)}
                    >
                      <RemoveBtn
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromStaging(game.id);
                        }}
                      >
                        X
                      </RemoveBtn>
                      <InfoBtn type="button" onClick={() => getGameInfo(game)}>
                        I
                      </InfoBtn>
                      <CoverImage src={game.coverUrl} alt={game.name} />
                    </StageCover>
                  ))}
                </StageStrip>
              )}
            </StageContainer>
            {!authLoading && user && (
              <SaveBtn onClick={() => SetShowSaveModal(true)}>Save List</SaveBtn>
            )}
          </BoardStack>
        </BoardViewport>
      </Background>
      <Footer />

      {/* Info modal */}
      {selectedGame && (
        <ModalBackdrop onClick={closeGameInfo}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalClose type="button" onClick={closeGameInfo}>
              X
            </ModalClose>
            {selectedGame.coverUrl && (
              <ModalCover src={selectedGame.coverUrl} alt={selectedGame.name} />
            )}
            <ModalTitle>{selectedGame.name}</ModalTitle>
            <ModalMeta>
              <p>
                Release:{" "}
                {selectedGame.releaseDate
                  ? new Date(selectedGame.releaseDate).toLocaleDateString()
                  : "Unknown"}
              </p>
              <p>
                Rating:{" "}
                {selectedGame.rating ? selectedGame.rating.toFixed(1) : "N/A"}
              </p>
              <p>
                Genres:{" "}
                {selectedGame.genres?.length
                  ? selectedGame.genres.join(", ")
                  : "N/A"}
              </p>
              <p>
                Platforms:{" "}
                {selectedGame.platforms?.length
                  ? selectedGame.platforms.join(", ")
                  : "N/A"}
              </p>
              {hltbLoading && <p>HowLongToBeat: loading...</p>}
              {hltbError && <p>HowLongToBeat: {hltbError}</p>}
              {hltb && (
                <>
                  <p>Main Story: {hltb.main ? `${hltb.main}h` : "N/A"}</p>
                  <p>
                    Main + Extras:{" "}
                    {hltb.mainExtra ? `${hltb.mainExtra}h` : "N/A"}
                  </p>
                  <p>
                    Completionist:{" "}
                    {hltb.completionist ? `${hltb.completionist}h` : "N/A"}
                  </p>
                </>
              )}
            </ModalMeta>
          </ModalCard>
        </ModalBackdrop>
      )}

      {/* save modal */}
      {showSaveModal && (
        <ModalBackdrop onClick={() => SetShowSaveModal(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalClose type="button" onClick={() => SetShowSaveModal(false)}>
              X
            </ModalClose>
            <ModalTitle> Name your list</ModalTitle>
            <SaveInput
              value={listname}
              onChange={(e) => setListname(e.target.value)}
              placeholder="My tier list"
              maxLength={60}
            />

            <SaveActions>
              <ModalBtn
                type="button"
                disabled={saveLoading || !listname.trim()}
                onClick={handleSaveList}
              >
                {saveLoading ? "Saving..." : "Save"}
              </ModalBtn>
            </SaveActions>
          </ModalCard>
        </ModalBackdrop>
      )}
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
  padding: 0.75rem 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BoardViewport = styled.div`
  width: ${CONTENT_WIDTH};
  max-width: 100%;
  padding-bottom: 0.25rem;
`;

const BoardStack = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const TierBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(10, 14, 19, 0.84);
  border: 1px solid rgba(190, 211, 228, 0.14);
  border-radius: 12px;
  overflow: hidden;
`;

const TierRow = styled.div`
  display: grid;
  min-height: ${TIER_ROW_MIN_HEIGHT};
  grid-template-columns: ${TIER_LABEL_WIDTH}px minmax(0, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const TierRank = styled.div`
  background: ${(props) => props.$color};
  color: #232323;
  font-weight: 700;
  font-size: clamp(0.8rem, min(1.5vw, 1.8vh), 1.12rem);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TierLane = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  padding: ${TIER_VERTICAL_PADDING} 0.65rem;
  background: linear-gradient(90deg, #0f1419 0%, #141a21 52%, #10151a 100%);
`;

const StageContainer = styled.div`
  margin: 1rem 0 1rem;
  width: 100%;
  min-height: ${STAGE_MIN_HEIGHT};
  background: rgba(8, 12, 18, 0.5);
  border: 1px solid rgba(141, 192, 255, 0.16);
  padding: ${STAGE_VERTICAL_PADDING};
  border-radius: 14px;
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.28);
  color: white;
  display: flex;
  gap: clamp(0.45rem, 0.9vh, 0.6rem);
  flex-direction: column;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  justify-content: flex-start;
`;

const StageText = styled.h1`
  font-size: clamp(1rem, min(3.2vw, 2.8vh), 1.8rem);
  text-align: center;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
`;

const SearchWrap = styled.div`
  width: ${CONTENT_WIDTH};
  margin: 0 0 1rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
`;
const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 0.8rem;
  border-radius: 8px;
  border: 1px solid;
  border-color: #10161d;
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
  gap: ${GAME_CARD_GAP};
  margin-top: 0.6rem;
  overflow-x: auto;
  padding: 0 0 0.25rem;
`;

const CoverButton = styled.button`
  flex: 0 0 auto;
  width: ${GAME_CARD_WIDTH};
  height: ${GAME_CARD_HEIGHT};
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
  gap: ${GAME_CARD_GAP};
  align-items: flex-start;
  min-height: ${GAME_CARD_HEIGHT};
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.25rem;
`;

const StageCover = styled.div`
  position: relative;
  flex: 0 0 auto;
  width: ${GAME_CARD_WIDTH};
  height: ${GAME_CARD_HEIGHT};
  border: 1px solid rgba(141, 192, 255, 0.25);
  border-radius: 8px;
  overflow: hidden;
`;

const SaveBtn = styled.button`
  width: 100%;

  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9px;
  padding: 0 1rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0b1624;
  background: linear-gradient(135deg, #8dc6ff 0%, #6daefe 100%);
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    filter 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.04);
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: clamp(3px, min(0.45vw, 0.45vh), 4px);
  right: clamp(3px, min(0.45vw, 0.45vh), 4px);
  width: clamp(16px, min(2.2vw, 2.3vh), 20px);
  height: clamp(16px, min(2.2vw, 2.3vh), 20px);
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: clamp(8px, min(0.9vw, 0.95vh), 10px);
  line-height: 1;
  cursor: pointer;
  z-index: 2;
`;

const InfoBtn = styled.button`
  position: absolute;
  top: clamp(3px, min(0.45vw, 0.45vh), 4px);
  left: clamp(3px, min(0.45vw, 0.45vh), 4px);
  width: clamp(16px, min(2.2vw, 2.3vh), 20px);
  height: clamp(16px, min(2.2vw, 2.3vh), 20px);
  border: none;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: clamp(8px, min(0.9vw, 0.95vh), 10px);
  line-height: 1;
  cursor: pointer;
  z-index: 2;
`;

const LaneStrip = styled.div`
  display: flex;
  gap: ${GAME_CARD_GAP};
  align-items: flex-start;
  min-height: ${GAME_CARD_HEIGHT};
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.25rem;
`;

const TierCover = styled.div`
  flex: 0 0 auto;
  width: ${GAME_CARD_WIDTH};
  height: ${GAME_CARD_HEIGHT};
  border: 1px solid rgba(141, 192, 255, 0.25);
  border-radius: 8px;
  overflow: hidden;
  cursor: grab;
  position: relative;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalCard = styled.div`
  position: relative;
  width: min(360px, 92vw);
  background: #10161d;
  border: 1px solid rgba(141, 192, 255, 0.28);
  border-radius: 12px;
  padding: 1rem;
  color: #fff;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
`;

const ModalCover = styled.img`
  width: ${GAME_CARD_WIDTH};
  height: ${GAME_CARD_HEIGHT};
  border-radius: 8px;
  object-fit: cover;
`;

const ModalTitle = styled.h3`
  margin: 0.7rem 0 0.5rem;
`;

const ModalMeta = styled.div`
  font-size: 0.9rem;
  line-height: 1.45;
`;

const SaveInput = styled.input`
  width: 100%;
  height: 40px;
  margin-top: 0.6rem;
  padding: 0 0.7rem;
  border-radius: 8px;
  border: 1px solid #2e3f53;
  background: #0f141a;
  color: #fff;
`;

const SaveActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.9rem;
`;

const ModalBtn = styled.button`
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
`;
