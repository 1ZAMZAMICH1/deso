import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// --- РЕСУРСЫ ---
import CatfishImage from '../assets/images/catfish-main.png';
import BackgroundImage from '../assets/images/background-image.jpg';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const PageContainer = styled.section`
  height: 100vh; width: 100vw; position: relative;
  display: flex; align-items: center; justify-content: flex-start;
  overflow: hidden; text-align: left;
`;

const BackgroundContainer = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
`;

const ShapeContainer = styled.div` // **КОНТЕЙНЕР ДЛЯ ФИГУРЫ**
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: #f7f9fc;
  
  // **ПРИМЕНЯЕМ SVG-МАСКУ**
  clip-path: url(#wave-clip-path);
`;

const OversizeCatfish = styled(motion.img)`
  position: absolute;
  right: -3vw;
  bottom: -0.50vh;
  width: 50vw;
  max-width: 1000px;
  height: auto;
  z-index: 2;
  filter: drop-shadow(40px 40px 60px rgba(0,0,0,0.15));
`;

const ContentWrapper = styled(motion.div)`
  max-width: 45vw;
  width: 100%;
  padding-left: 5%;
  z-index: 5;
  color: #1c2a3a;
`;

const MainContent = styled.div``;

const Tagline = styled(motion.p)`
  font-size: 1rem;
  font-weight: 600;
  color: #F9A826;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  text-transform: uppercase;
  margin: 0;

  span {
    display: block;
  }
  
  .secondary-title {
    font-size: 2rem;
    font-weight: 700;
    color: #5a6470;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.5 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

export const MainScreen = () => {
  return (
    <PageContainer>
      {/* **SVG-ФИГУРА ДЛЯ МАСКИ** */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="wave-clip-path" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 H 0.6 C 0.5,0.2 0.7,0.4 0.55,0.5 S 0.5,0.8 0.65,1 H 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <BackgroundContainer />
      <ShapeContainer />
      
      <OversizeCatfish
        src={CatfishImage}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      <ContentWrapper variants={containerVariants} initial="hidden" animate="visible">
        <MainContent>
            <Tagline variants={itemVariants}>Твой ключ к лучшим местам для рыбалки</Tagline>
            <Title variants={itemVariants}>
              <span>Рыболовный</span>
              <span>путеводитель</span>
              <span className="secondary-title">по Туркестанской области</span>
            </Title>
        </MainContent>
      </ContentWrapper>
    </PageContainer>
  );
};