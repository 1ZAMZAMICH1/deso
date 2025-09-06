import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { FiSunrise, FiSun, FiSunset, FiMoon } from 'react-icons/fi';

// --- ИСХОДНЫЕ ДАННЫЕ С ИНФОЙ ДЛЯ ВИДЖЕТОВ ---
import sazanImg from '../assets/images/fish/sazan.png';
import sudakImg from '../assets/images/fish/sudak.png';
import somImg from '../assets/images/fish/som.png';
import zherehImg from '../assets/images/fish/zhereh.png';
// ▼▼▼ ДОБАВИЛИ ИМПОРТЫ ДЛЯ НОВЫХ РЫБ ▼▼▼
import karpImg from '../assets/images/fish/karp.png';
import shukaImg from '../assets/images/fish/shuka.png';
import leshImg from '../assets/images/fish/lesh.png';
import plotvaImg from '../assets/images/fish/plotva.png';
import goliyanImg from '../assets/images/fish/goliyan.png';
import zmeegolovImg from '../assets/images/fish/zmeegolov.png';

const initialFishData = [
  { id: 1, name: 'Сазан', image: sazanImg, description: 'Сильная и хитрая рыба, король пресных вод. Его мощные поклевки и отчаянное сопротивление делают его желанным трофеем.', habitat: 'Предпочитает тихие, глубокие участки с илистым дном. Часто держится в коряжниках, у подмытых берегов и в ямах.', locations: 'Шардаринское вдхр., Река Сырдарья, Коксарайский контррегулятор', tackle: 'Мощные карповые или фидерные удилища, надежные катушки.', bait: 'Консервированная кукуруза, бойлы, выползок, жмых.', biteMonths: [5, 6, 7, 8], difficulty: 2, peakTime: ['morning', 'evening'] },
  { id: 2, name: 'Судак', image: sudakImg, description: 'Агрессивный стайный хищник с характерными "клыками". Ценится за вкусное, нежирное мясо и спортивный интерес при ловле.', habitat: 'Требователен к чистоте воды. Обитает на участках с твердым, каменистым или песчаным дном.', locations: 'Шардаринское вдхр., Река Бадам, Река Арыс', tackle: 'Спиннинг с быстрым строем, джиговые оснастки, воблеры.', bait: 'Силиконовые приманки, поролоновые рыбки, воблеры.', biteMonths: [4, 5, 9, 10], difficulty: 2, peakTime: ['morning', 'evening'] },
  { id: 3, name: 'Сом', image: somImg, description: 'Крупнейший пресноводный хищник, хозяин речных глубин. Ловля сома — это испытание снастей и рыболова на прочность.', habitat: 'Обитает в самых глубоких местах: омуты, ямы, затопленные русла. Предпочитает захламленное дно.', locations: 'Река Сырдарья, Шардаринское вдхр.', tackle: 'Сверхмощные донные удилища, мультипликаторные катушки.', bait: 'Крупный живец, лягушка, пучок выползков, печень.', biteMonths: [6, 7, 8], difficulty: 3, peakTime: ['evening', 'night'] },
  { id: 4, name: 'Жерех', image: zherehImg, description: 'Очень осторожный и стремительный хищник. Его атаки, известные как "бой", — захватывающее зрелище.', habitat: 'Типичный обитатель рек с быстрым течением. Держится у перекатов, ниже островов и кос.', locations: 'Река Сырдарья, Река Арыс', tackle: 'Дальнобойный спиннинг, скоростная катушка.', bait: 'Тяжелые блесны (кастмастер), девоны, воблеры.', biteMonths: [5, 6, 7], difficulty: 3, peakTime: ['day'] },
  // ▼▼▼ ДОБАВИЛИ ДАННЫЕ ДЛЯ НОВЫХ РЫБ ▼▼▼
  { id: 5, name: 'Карп', image: karpImg, description: 'Близкий родственник сазана, одомашненная форма. Отличается высоким телом и неприхотливостью. Популярен в платной рыбалке.', habitat: 'Пруды, озера, водохранилища со стоячей или слабопроточной водой. Любит заиленные участки.', locations: 'Частные пруды, озера Акколь, Кызылколь', tackle: 'Поплавочные и донные удочки, фидер.', bait: 'Кукуруза, червь, опарыш, тесто, бойлы.', biteMonths: [5, 6, 7, 8, 9], difficulty: 1, peakTime: ['morning', 'day', 'evening'] },
  { id: 6, name: 'Щука', image: shukaImg, description: 'Классический пресноводный хищник, известный своей засадной тактикой охоты и острыми зубами. Желанный трофей спиннингиста.', habitat: 'Заросли камыша, коряжники, границы чистой воды и растительности. Избегает быстрого течения.', locations: 'Река Сырдарья (заливы), озера системы Шошкаколь', tackle: 'Спиннинг, жерлицы, кружки.', bait: 'Блесны, воблеры, силиконовые приманки, живец.', biteMonths: [3, 4, 9, 10, 11], difficulty: 2, peakTime: ['morning', 'evening'] },
  { id: 7, name: 'Лещ', image: leshImg, description: 'Стайная рыба с характерным высоким, сплющенным телом. Ценится за вкусное мясо, особенно в вяленом виде.', habitat: 'Глубокие ямы, русловые бровки на реках и водохранилищах. Предпочитает глинистое или илистое дно.', locations: 'Шардаринское вдхр., Коксарайский контррегулятор', tackle: 'Фидер, донные удочки.', bait: 'Червь, опарыш, мотыль, перловка, кукуруза.', biteMonths: [5, 6, 7, 8], difficulty: 1, peakTime: ['morning', 'night'] },
  { id: 8, name: 'Плотва', image: plotvaImg, description: 'Одна из самых распространенных рыб. Небольшая, но бойкая, часто становится первой добычей начинающего рыболова.', habitat: 'Обитает практически везде: реки, озера, пруды. Держится стайками у берега, в зарослях.', locations: 'Река Бадам, Река Арыс, небольшие озера', tackle: 'Легкая поплавочная удочка, мормышка.', bait: 'Опарыш, мотыль, тесто, хлеб.', biteMonths: [4, 5, 6, 7, 8, 9], difficulty: 1, peakTime: ['day'] },
  { id: 9, name: 'Гольян', image: goliyanImg, description: 'Мелкая, юркая рыбка, часто образующая огромные стаи. Является важным кормовым объектом для хищников.', habitat: 'Ручьи и небольшие реки с чистой, прохладной водой и каменистым дном.', locations: 'Горные притоки рек Аксу, Сайрам-су', tackle: 'Сверхлегкая поплавочная удочка, наноджиг.', bait: 'Мотыль, опарыш, мелкие мушки.', biteMonths: [5, 6, 7], difficulty: 1, peakTime: ['day'] },
  { id: 10, name: 'Змееголов', image: zmeegolovImg, description: 'Экзотический и невероятно живучий хищник. Способен дышать атмосферным воздухом. Агрессивен и силен.', habitat: 'Сильно заросшие, мелководные, хорошо прогреваемые водоемы. Часто встречается на рисовых чеках.', locations: 'Озера системы Шошкаколь, Шардаринское вдхр. (мелководье)', tackle: 'Мощный спиннинг, незацепляющиеся приманки.', bait: 'Силиконовые лягушки, крупный живец.', biteMonths: [6, 7, 8], difficulty: 3, peakTime: ['morning', 'day'] },
];
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// Мы больше не будем искусственно размножать массив, будем использовать полный список
// const fullFishData = Array.from({ length: 6 }).flatMap((_, i) => initialFishData.map((fish, j) => ({ ...fish, id: i * initialFishData.length + j + 1, })));
const fullFishData = initialFishData;
const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const PageContainer = styled.section` height: 100vh; width: 100vw; display: flex; overflow: hidden; position: relative; background: #f0f4f8; `;
const FishList = styled.ul` list-style: none; padding: 2rem 0; margin: 0; display: flex; flex-direction: column; flex-basis: 30%; height: 100%; z-index: 10; padding-left: 5%; overflow-y: auto; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-track { background: transparent; } &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; } `;

// ▼▼▼ ГЛАВНОЕ ИЗМЕНЕНИЕ: ИСПРАВЛЯЕМ ШРИФТ В МЕНЮ ▼▼▼
const FishListItem = styled.li`
  font-size: 2.2rem;
  font-weight: 900;
  cursor: pointer;
  text-transform: uppercase;
  line-height: 1.5;
  transition: all 0.4s ease;
  color: #dbe1e8; /* Неактивный цвет стал светлее и плотнее */

  &.active,
  &:hover {
    color: #0a111a;
  }
`;
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const ContentArea = styled.div` flex-basis: 70%; position: relative; width: 100%; height: 100%; `;
const FishDisplay = styled(motion.div)` position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; padding: 2rem 5% 2rem 2rem; `;
const TopSection = styled.div` display: grid; grid-template-columns: 1fr auto 1fr; gap: 6rem; align-items: flex-start; flex-grow: 1; `;
const TextColumn = styled.div` text-align: left; padding-top: 2rem; `;
const InfoSubBlock = styled.div` margin-bottom: 2rem; &:last-child { margin-bottom: 0; } `;
const FishImageContainer = styled(motion.div)` width: 30vw; height: 35vh; max-width: 910px; max-height: 660px; display: flex; align-items: center; justify-content: center; img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2)); } `;
const BottomSection = styled.div` flex-shrink: 0; text-align: center; margin-top: -2rem; `;
const InfoTitle = styled.h2` font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; color: #1c2a3a; `;
const PrimaryDescription = styled.p` font-size: 1rem; line-height: 1.6; color: #3d4852; max-width: 600px; margin: 0 auto 1.5rem auto; `;
const InfoText = styled.p` font-size: 0.9rem; line-height: 1.6; color: #5a6470; `;
const InfoSubtitle = styled.h4` font-size: 0.9rem; font-weight: 700; color: #F9A826; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; `;

// --- ВИДЖЕТЫ ---
const WidgetsContainer = styled.div` display: flex; justify-content: center; align-items: flex-start; gap: 2.5rem; margin-top: 1rem; `;
const Widget = styled.div` display: flex; flex-direction: column; align-items: center; min-width: 140px; `;
const BiteChart = styled.div` position: relative; width: 140px; height: 140px; `;
const MonthLabel = styled.span` position: absolute; font-size: 0.65rem; color: ${({ $isActive }) => $isActive ? '#fff' : '#aaa'}; font-weight: 700; left: 50%; top: 50%; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: ${({ $isActive }) => $isActive ? '#F9A826' : 'rgba(0,0,0,0.03)'}; transform: ${({ $angle }) => `rotate(${$angle}deg) translate(56px) rotate(-${$angle}deg)`}; transform-origin: 0 0; transition: all 0.4s ease; `;
const StarsContainer = styled.div` display: flex; gap: 0.5rem; font-size: 1.5rem; color: #F9A826; margin-top: 0.5rem; height: 70px; align-items: center; `;
const PeakTimeContainer = styled.div` display: flex; gap: 1rem; font-size: 1.5rem; margin-top: 0.5rem; height: 70px; align-items: center; `;
const TimeIcon = styled.div` color: ${({ $isActive }) => $isActive ? '#1c2a3a' : '#ddd'}; transition: color 0.5s; `;

// --- КОМПОНЕНТЫ ВИДЖЕТОВ ---
const BiteCircle = ({ activeMonths }) => { const segmentAngle = 360 / 12; return ( <BiteChart> {months.map((month, i) => ( <MonthLabel key={month} $angle={i * segmentAngle} $isActive={activeMonths.includes(i + 1)}> {month} </MonthLabel> ))} </BiteChart> ); };
const DifficultyWidget = ({ level }) => ( <Widget> <InfoSubtitle>Сложность</InfoSubtitle> <StarsContainer> {Array.from({ length: 3 }).map((_, i) => ( i < level ? <BsStarFill key={i} /> : <BsStar key={i} style={{ color: '#e0e0e0' }} /> ))} </StarsContainer> </Widget> );
const PeakTimeWidget = ({ peakTime }) => { const times = [ { icon: <FiSunrise />, period: 'morning' }, { icon: <FiSun />, period: 'day' }, { icon: <FiSunset />, period: 'evening' }, { icon: <FiMoon />, period: 'night' }, ]; return ( <Widget> <InfoSubtitle>Время клёва</InfoSubtitle> <PeakTimeContainer> {times.map(t => <TimeIcon key={t.period} $isActive={peakTime.includes(t.period)}>{t.icon}</TimeIcon>)} </PeakTimeContainer> </Widget> ); };

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export const FishEncyclopedia = () => {
  const [selectedId, setSelectedId] = useState(fullFishData[0].id);
  const activeFish = fullFishData.find(f => f.id === selectedId);
  const contentVariants = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } }, exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }, };

  return (
    <PageContainer>
      <FishList> {fullFishData.map(fish => ( <FishListItem key={fish.id} className={fish.id === selectedId ? 'active' : ''} onClick={() => setSelectedId(fish.id)}> {fish.name} </FishListItem> ))} </FishList>
      <ContentArea>
        <AnimatePresence exitBeforeEnter>
          {activeFish && ( // Добавили проверку на случай, если activeFish не найден
            <FishDisplay key={activeFish.id} variants={contentVariants} initial="initial" animate="animate" exit="exit">
              <TopSection>
                <TextColumn>
                  <InfoSubBlock>
                    <InfoSubtitle>Среда обитания</InfoSubtitle>
                    <InfoText>{activeFish.habitat}</InfoText>
                  </InfoSubBlock>
                  <InfoSubBlock>
                    <InfoSubtitle>Основные места</InfoSubtitle>
                    <InfoText>{activeFish.locations}</InfoText>
                  </InfoSubBlock>
                </TextColumn>
                <FishImageContainer> <img src={activeFish.image} alt={activeFish.name} /> </FishImageContainer>
                <TextColumn>
                  <InfoSubBlock>
                    <InfoSubtitle>Снасти</InfoSubtitle>
                    <InfoText>{activeFish.tackle}</InfoText>
                  </InfoSubBlock>
                  <InfoSubBlock>
                    <InfoSubtitle>Наживка</InfoSubtitle>
                    <InfoText>{activeFish.bait}</InfoText>
                  </InfoSubBlock>
                </TextColumn>
              </TopSection>
              <BottomSection>
                <InfoTitle>{activeFish.name}</InfoTitle>
                <PrimaryDescription>{activeFish.description}</PrimaryDescription>
                <WidgetsContainer>
                  <DifficultyWidget level={activeFish.difficulty} />
                  <PeakTimeWidget peakTime={activeFish.peakTime} />
                  <Widget><InfoSubtitle>Календарь клёва</InfoSubtitle><BiteCircle activeMonths={activeFish.biteMonths} /></Widget>
                </WidgetsContainer>
              </BottomSection>
            </FishDisplay>
          )}
        </AnimatePresence>
      </ContentArea>
    </PageContainer>
  );
};