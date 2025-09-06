import React from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Импортируем наш ЛОКАЛЬНЫЙ, НАДЕЖНЫЙ файл с данными
import { hydrographyData } from '../assets/data/turkistan_hydrography_full.js';

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ ---
const PageContainer = styled.section`
  height: 100vh; width: 100vw; display: flex; flex-direction: column;
  overflow: hidden; background: #f7f9fc;
`;

const Header = styled.div`
  padding: 1.5rem 5%; text-align: center;
  border-bottom: 1px solid #e0e6ed; flex-shrink: 0;
  z-index: 1000; background-color: #f7f9fc;
`;

const Title = styled.h1`
  font-size: 2.5rem; font-weight: 900; color: #1c2a3a;
  margin: 0; text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1rem; color: #5a6470; margin: 0.5rem 0 0 0;
`;

const MapWrapper = styled.div`
  flex-grow: 1; width: 100%;
  .leaflet-container {
    height: 100%; width: 100%; background-color: #f7f9fc;
  }
`;

// --- КОНФИГУРАЦИЯ И СТИЛИ КАРТЫ ---
const mapCenter = [43.3, 68.3];
const mapZoom = 8;

const hydroStyle = {
  color: "#3b82f6", weight: 2.5, opacity: 0.8,
};

const highlightStyle = {
  color: '#F9A826', weight: 5, opacity: 1,
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export const WaterMap = () => {
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        e.target.setStyle(highlightStyle);
        e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(hydroStyle);
      },
    });
  };

  return (
    <PageContainer>
      <Header>
        <Title>Атлас Водных Ресурсов</Title>
        <Subtitle>Гидрографическая сеть Туркестанской области</Subtitle>
      </Header>
      <MapWrapper>
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          scrollWheelZoom={true} 
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <GeoJSON 
            data={hydrographyData} 
            style={hydroStyle} 
            onEachFeature={onEachFeature} 
          >
            <Tooltip>
              {(layer) => layer.feature.properties.name || 'Водный объект'}
            </Tooltip>
          </GeoJSON>
        </MapContainer>
      </MapWrapper>
    </PageContainer>
  );
};