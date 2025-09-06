import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// --- ИСХОДНЫЕ ДАННЫЕ И РЕСУРСЫ ---
import syrdaryaImg from '../assets/images/locations/syrdarya.jpg';
import shardaraImg from '../assets/images/locations/shardara.jpg';
import koksarayImg from '../assets/images/locations/koksaray.jpg';
import badamImg from '../assets/images/locations/badam.jpg';
import akerenImg from '../assets/images/locations/akeren.jpg';

const initialLocations = [
  { id: 1, subtitle: 'Главная артерия региона', title: 'Река Сырдарья', description: 'Одна из крупнейших рек Центральной Азии, Сырдарья является жизненно важным источником для рыбалки и сельского хозяйства.', image: syrdaryaImg, },
  { id: 2, subtitle: 'Искусственное море', title: 'Шардаринское вдхр.', description: 'Популярное место для спортивной и любительской рыбалки. Здесь водятся сазан, судак, лещ и знаменитый шардаринский сом.', image: shardaraImg, },
  { id: 3, subtitle: 'Регулятор стока', title: 'Коксарайское вдхр.', description: 'Важный гидроузел, созданный для защиты от паводков. Водохранилище также зарыбляется и привлекает рыбаков.', image: koksarayImg, },
  { id: 4, subtitle: 'Приток Сырдарьи', title: 'Река Бадам', description: 'Небольшая, но живописная река, протекающая недалеко от Шымкента. Отличное место для ловли маринки и усача.', image: badamImg, },
  { id: 5, subtitle: 'Горная жемчужина', title: 'Озеро Акерен', description: 'Высокогорное озеро с кристально чистой водой. Хотя рыбалка здесь может быть сложной, пейзажи и уединение стоят того.', image: akerenImg, },
];

const VISIBLE_CARDS = 4;

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const PageContainer = styled.section`
  height: 100vh; width: 100vw; display: flex; overflow: hidden; position: relative; color: #fff; background-color: #1a1a1a;
`;
const ContentWrapper = styled.div`
  display: flex; width: 100%; height: 100%; padding: 0 5%; align-items: center; z-index: 2;
  @media (max-width: 1024px) { flex-direction: column; justify-content: flex-end; padding-bottom: 2rem; }
`;
const TextContent = styled(motion.div)`
  flex-basis: 50%; // Занимает 50% ширины
  padding-right: 2rem; // Отступ от карточек
  align-self: center; // Вертикальное выравнивание по центру
  @media (max-width: 1024px) { flex-basis: auto; align-self: center; max-width: 100%; margin-bottom: 2rem; text-align: center; padding-right: 0; }
`;
const Subtitle = styled.p`
  font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; color: #F9A826; margin-bottom: 1rem;
`;
const Title = styled.h1`
  font-size: 5rem; font-weight: 900; line-height: 1.1; text-transform: uppercase; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); @media (max-width: 768px) { font-size: 3.5rem; }
`;
const Description = styled.p`
  font-size: 1rem; line-height: 1.6; max-width: 500px; @media (max-width: 1024px) { margin: 0 auto; }
`;
const SliderSection = styled.div`
  flex-basis: 50%; // Занимает 50% ширины
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start; // Выравнивание по левому краю секции
  align-self: flex-end; // **ОПУСКАЕМ ВЕСЬ БЛОК ВНИЗ**
  padding-bottom: 5rem; // Отступ снизу
  @media (max-width: 1024px) { flex-basis: auto; width: 100%; align-items: center; padding-bottom: 2rem; }
`;
const CardsContainer = styled.div`
  display: flex; gap: 20px; margin-bottom: 2rem; position: relative;
`;
const CardWrapper = styled(motion.div)`
  width: 180px; height: 250px; border-radius: 16px; overflow: hidden; cursor: pointer; position: relative; background: #333; box-shadow: 0 10px 20px rgba(0,0,0,0.4);
`;
const CardImage = styled(motion.img)`
  width: 100%; height: 100%; object-fit: cover;
`;
const CardOverlay = styled(motion.div)`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
`;
const CardTitle = styled(motion.h3)`
  position: absolute; bottom: 1rem; left: 1rem; right: 1rem; font-size: 1.2rem; font-weight: 700; color: white;
`;
const Controls = styled.div`
  display: flex; align-items: center; gap: 1.5rem; width: 300px;
`;
const ArrowButton = styled.button`
  background: transparent; border: 1px solid #fff; color: #fff; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: all 0.3s;
  &:hover { background: #F9A826; border-color: #F9A826; }
`;
const ProgressBar = styled.div`
  flex: 1; height: 2px; background-color: rgba(255, 255, 255, 0.3);
`;
const Progress = styled(motion.div)`
  height: 100%; background-color: #F9A826;
`;

// --- ПЛАВНАЯ АНИМАЦИЯ ---
const transition = { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.9] };

// --- КОМПОНЕНТЫ ДЛЯ АНИМАЦИИ ---
const AnimatedBackground = ({ location }) => (
  <CardWrapper
    layoutId={`card-container-${location.id}`}
    style={{
      position: 'absolute', top: 0, left: 0,
      width: '100vw', height: '100vh',
      borderRadius: 0, zIndex: 0, cursor: 'default',
    }}
    transition={transition}
  >
    <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }} />
    <CardImage layoutId={`card-image-${location.id}`} src={location.image} transition={transition} />
  </CardWrapper>
);

const Card = ({ location, onClick }) => (
  <CardWrapper
    layoutId={`card-container-${location.id}`}
    onClick={onClick}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }}
    exit={{ opacity: 0, transition: { duration: 0.3 } }}
    transition={transition}
  >
    <CardImage layoutId={`card-image-${location.id}`} src={location.image} transition={transition} />
    <CardOverlay />
    <CardTitle>{location.title}</CardTitle>
  </CardWrapper>
);

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export const LocationsSlider = () => {
  const [locations, setLocations] = useState(initialLocations);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeLocation = locations[0];
  const visibleCards = locations.slice(1, VISIBLE_CARDS + 1);
  const activeIndexInInitial = initialLocations.findIndex(item => item.id === activeLocation.id);

  const rotate = (newLocations) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setLocations(newLocations);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleNext = () => {
    const newLocations = [...locations];
    newLocations.push(newLocations.shift());
    rotate(newLocations);
  };

  const handlePrev = () => {
    const newLocations = [...locations];
    newLocations.unshift(newLocations.pop());
    rotate(newLocations);
  };

  const handleClickCard = (cardId) => {
    const cardIndex = locations.findIndex(loc => loc.id === cardId);
    if (cardIndex <= 0) return;
    const newLocations = [...locations];
    const toMove = newLocations.splice(0, cardIndex);
    const reordered = [...newLocations, ...toMove];
    rotate(reordered);
  };

  return (
    <LayoutGroup>
      <PageContainer id="locations">
        <AnimatePresence>
          <AnimatedBackground key={activeLocation.id} location={activeLocation} />
        </AnimatePresence>
        
        <ContentWrapper>
          <AnimatePresence>
            <TextContent key={activeLocation.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.4 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }} >
              <Subtitle>{activeLocation.subtitle}</Subtitle>
              <Title>{activeLocation.title}</Title>
              <Description>{activeLocation.description}</Description>
            </TextContent>
          </AnimatePresence>
          
          <SliderSection>
            <CardsContainer>
              <AnimatePresence>
                {visibleCards.map((location) => (
                  <Card key={location.id} location={location} onClick={() => handleClickCard(location.id)} />
                ))}
              </AnimatePresence>
            </CardsContainer>
            <Controls>
              <ArrowButton onClick={handlePrev}>‹</ArrowButton>
              <ProgressBar>
                <Progress initial={{ width: 0 }} animate={{ width: `${((activeIndexInInitial + 1) / initialLocations.length) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
              </ProgressBar>
              <ArrowButton onClick={handleNext}>›</ArrowButton>
            </Controls>
          </SliderSection>
        </ContentWrapper>
      </PageContainer>
    </LayoutGroup>
  );
};