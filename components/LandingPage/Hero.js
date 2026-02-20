import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const tiers = [
  { rank: "S", color: "#f77982" },
  { rank: "A", color: "#f6be7d" },
  { rank: "B", color: "#f5df7c" },
  { rank: "C", color: "#eef57b" },
  { rank: "D", color: "#b0f57d" },
  { rank: "E", color: "#8bf185" },
  { rank: "F", color: "#74eb83" },
];

const coverArtPaths = [
  "/images/co1mws.webp",
  "/images/co1qrn.webp",
  "/images/co1qro.webp",
  "/images/co1qrp.webp",
  "/images/co1qrr.webp",
  "/images/co1wc0.webp",
  "/images/co1wnc.webp",
  "/images/co1x77.webp",
  "/images/co1xha.webp",
  "/images/co1xhc.webp",
  "/images/co1xhf.webp",
  "/images/co1xhg.webp",
  "/images/co8ado.webp",
  "/images/co1xhh.webp",
  "/images/co1xi3.webp",
  "/images/co20po.webp",
  "/images/co20pp.webp",
  "/images/co27zd.webp",
  "/images/co2807.webp",
  "/images/co2bvz.webp",
  "/images/co2dto.webp",
  "/images/co2hgu.webp",
  "/images/co2j0q.webp",
  "/images/co2qk0.webp",
  "/images/co2qk2.webp",
  "/images/co2r2r.webp",
  "/images/co3jk7.webp",
  "/images/co4w36.webp",
  "/images/co5bze.webp",
  "/images/co5vx0.webp",
  "/images/co6up6.webp",
  "/images/co7qc9.webp",
  "/images/co7z02.webp",
  "/images/co8ghf.webp",
];

const emptyTierMap = Object.fromEntries(tiers.map((tier) => [tier.rank, []]));

const buildRandomTierMap = () => {
  const shuffled = [...coverArtPaths].sort(() => Math.random() - 0.5);
  const tierMap = Object.fromEntries(tiers.map((tier) => [tier.rank, []]));

  tiers.forEach((tier) => {
    const nextCover = shuffled.pop();
    if (nextCover) {
      tierMap[tier.rank].push(nextCover);
    }
  });

  while (shuffled.length > 0) {
    const randomTier = tiers[Math.floor(Math.random() * tiers.length)].rank;
    tierMap[randomTier].push(shuffled.pop());
  }

  return tierMap;
};

const Hero = () => {
  const [tierCovers, setTierCovers] = useState(emptyTierMap);

  useEffect(() => {
    setTierCovers(buildRandomTierMap());
  }, []);

  return (
    <Section>
      <Container>
        <LeftContent>
          <Eyebrow>GameListr</Eyebrow>
          <HeroTitle>
            Rank Your Favorite Titles <Highlight>S</Highlight> to{" "}
            <Highlight>F</Highlight>
          </HeroTitle>
          <HeroSubtext>
            Build a clean, shareable tier list and keep your best picks on top.
          </HeroSubtext>
          <HeroActions>
            <HeroButtonLink href="/mylists">Start New List</HeroButtonLink>
            <SecondaryButton>View Examples</SecondaryButton>
          </HeroActions>
        </LeftContent>

        <TierBox>
          {tiers.map((tier) => (
            <TierRow key={tier.rank}>
              <TierRank $color={tier.color}>{tier.rank}</TierRank>
              <TierLane>
                <LaneContent>
                  {tierCovers[tier.rank]?.map((cover, index) => (
                    <CoverCard
                      key={`${tier.rank}-${cover}-${index}`}
                      src={cover}
                      alt={`${tier.rank} tier cover ${index + 1}`}
                    />
                  ))}
                </LaneContent>
              </TierLane>
            </TierRow>
          ))}
        </TierBox>
      </Container>
    </Section>
  );
};

const Section = styled.section`
  --hero-ink: #f8fbff;
  --hero-muted: #d4e0ea;
  --hero-panel: rgba(10, 14, 19, 0.84);
  --hero-panel-border: rgba(190, 211, 228, 0.14);
  --hero-lane: #11161b;
  --hero-lane-edge: #0b0f13;

  position: relative;
  width: 100%;
  min-height: clamp(560px, 72vh, 760px);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -12px;
    background-image:
      radial-gradient(
        circle at 16% 24%,
        rgba(66, 153, 225, 0.25),
        transparent 32%
      ),
      radial-gradient(
        circle at 84% 68%,
        rgba(249, 115, 22, 0.2),
        transparent 34%
      ),
      linear-gradient(rgba(2, 6, 12, 0.45), rgba(2, 6, 12, 0.65)),
      url("/images/gamelibrary.png");
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    filter: blur(8px);
    transform: scale(1.04);
    z-index: 0;
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  min-height: clamp(560px, 72vh, 760px);
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
    padding: 2.25rem 1.1rem;
    gap: 1.3rem;
  }
`;

const LeftContent = styled.div`
  max-width: 560px;
  color: var(--hero-ink);
  padding: 1.3rem 1.35rem;
  border-radius: 14px;
  background: rgba(8, 12, 18, 0.46);
  border: 1px solid rgba(190, 211, 228, 0.1);
  backdrop-filter: blur(2px);
`;

const Eyebrow = styled.p`
  margin: 0 0 0.8rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: #8dc0ff;
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.9rem;
  font-family: "Sora", "Avenir Next", sans-serif;
  font-size: clamp(2rem, 4.4vw, 3.55rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
`;

const HeroSubtext = styled.p`
  margin: 0;
  max-width: 48ch;
  color: var(--hero-muted);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  line-height: 1.45;
`;

const Highlight = styled.span`
  color: #7cc1ff;
`;

const HeroActions = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const TierBox = styled.div`
  width: min(520px, 100%);
  justify-self: end;
  background: var(--hero-panel);
  border: 1px solid var(--hero-panel-border);
  border-radius: 12px;
  z-index: 2;
  overflow: hidden;
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.36);

  @media (max-width: 950px) {
    width: 100%;
    justify-self: stretch;
  }
`;

const TierRow = styled.div`
  display: grid;
  grid-template-columns: 74px 1fr;
  min-height: 64px;
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

const LaneContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  overflow: hidden;
`;

const CoverCard = styled.img`
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(205, 221, 237, 0.22);
  background: #0b1014;
`;

const HeroButtonLink = styled(Link)`
  min-width: 150px;
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

const SecondaryButton = styled.button`
  min-width: 150px;
  height: 44px;
  border-radius: 9px;
  padding: 0 1rem;
  font-family: "Chakra Petch", "Trebuchet MS", sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  color: #d8e8f7;
  background: rgba(13, 20, 28, 0.82);
  border: 1px solid rgba(196, 217, 235, 0.2);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(16, 25, 35, 0.95);
  }
`;

export default Hero;
