import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';

// Твой рабочий ключ Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiemFtemFtaWNoIiwiYSI6ImNtZjVjdjNtazA0dWcybHM4bm9vZTBtamcifQ.xqkEctPIz6_ZCSemEwDa4g';

// --- ДАННЫЕ ЛОКАЦИЙ ---
// ▼▼▼ ГЛАВНОЕ ИЗМЕНЕНИЕ: Уменьшили bbox для рек, чтобы камера не улетала ▼▼▼
const locationsData = [
  { id: 'shardara', name: 'Шардаринское вдхр.', center: [68.17302, 41.12901], zoom: 9.5, pitch: 60, bearing: -30, name_en: 'Shardara Reservoir' },
  { id: 'koksaray', name: 'Коксарай', center: [68.45407, 42.35544], zoom: 11, pitch: 55, bearing: 0, name_en: 'Koksaray Counter-Regulator' },
  { id: 'bugun', name: 'Бугуньское вдхр.', center: [69.05384, 42.73185], zoom: 11.5, pitch: 60, bearing: 45, name_en: 'Bogen Reservoir' },
  { id: 'syrdarya', name: 'Река Сырдарья', bbox: [[67.8, 41.8], [68.5, 43.5]], name_en: 'Syr Darya' },
  { id: 'arys', name: 'Река Арыс', bbox: [[68.25, 42.35], [69.2, 42.55]], name_en: 'Arys' },
];
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// --- СТИЛИЗОВАННЫЕ КОМПОНЕНТЫ (без изменений) ---
const PageContainer = styled.section` height: 100vh; width: 100vw; display: flex; position: relative; overflow: hidden; `;
const SidePanel = styled(motion.div)` flex-shrink: 0; width: 30%; height: 100%; background-color: #f0f4f8; padding: 4rem; display: flex; flex-direction: column; box-shadow: 5px 0 30px rgba(0,0,0,0.1); z-index: 100; `;
const Header = styled.div` color: #1c2a3a; margin-bottom: 3rem; `;
const Title = styled.h1` font-size: 3.5rem; font-weight: 900; line-height: 1.1; text-transform: uppercase; `;
const Subtitle = styled.p` font-size: 1rem; font-weight: 700; color: #5a6470; margin-top: 0.5rem; `;
const LocationsList = styled.ul` list-style: none; padding: 0; margin: 0; overflow-y: auto; `;
const LocationButton = styled.button` font-family: 'Montserrat', sans-serif; width: 100%; text-align: left; font-size: 1.5rem; font-weight: 900; text-transform: uppercase; padding: 1rem 1.5rem; margin-bottom: 1rem; border-radius: 12px; border: none; background: transparent; color: #5a6470; opacity: 0.5; cursor: pointer; transition: all 0.3s ease; &:hover { opacity: 1; background-color: #e1e7ee; } &.active { opacity: 1; color: #fff; background-color: #F9A826; transform: translateX(10px); box-shadow: 0 10px 20px rgba(249, 168, 38, 0.3); } `;
const MapArea = styled.div` flex-grow: 1; height: 100%; position: relative; `;

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export const HydrographyAtlas = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [activeLocation, setActiveLocation] = useState(locationsData[0]);
  const timeoutId = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current, style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [68.7, 43.0], zoom: 7, pitch: 45, bearing: -17.6,
      antialias: true, maxBounds: [[65, 40], [72, 46]],
      attributionControl: false,
    });

    mapRef.current.scrollZoom.disable(); mapRef.current.dragPan.disable();
    mapRef.current.dragRotate.disable(); mapRef.current.touchZoomRotate.disable();
    mapRef.current.doubleClickZoom.disable();

    mapRef.current.on('load', () => {
      mapRef.current.addSource('mapbox-dem', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1' });
      mapRef.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      mapRef.current.addLayer({
        'id': 'water-styled', 'type': 'fill', 'source': 'composite', 'source-layer': 'water',
        'paint': { 'fill-color': '#003f5c', 'fill-opacity': 0.7 }
      });
      mapRef.current.addLayer({
        'id': 'waterway-styled', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway',
        'paint': { 'line-color': '#003f5c', 'line-width': 2, 'line-opacity': 0.8 }
      });
      mapRef.current.addLayer({
        'id': 'water-highlight-blur', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway',
        'paint': { 'line-color': '#00f2ff', 'line-width': 15, 'line-opacity': 0, 'line-blur': 20 }
      });
      mapRef.current.addLayer({
        'id': 'water-highlight-main', 'type': 'line', 'source': 'composite', 'source-layer': 'waterway',
        'paint': { 'line-color': '#ffffff', 'line-width': 4, 'line-opacity': 0 }
      });

      locationsData.forEach(loc => {
        if (loc.center) {
            const el = document.createElement('div'); el.className = 'custom-marker';
            new mapboxgl.Marker(el).setLngLat(loc.center).addTo(mapRef.current);
        }
      });
      flyToLocation(locationsData[0], 6000);
    });

    return () => { 
        if(timeoutId.current) clearTimeout(timeoutId.current);
        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } 
    };
  }, []);

  const flyToLocation = (location, duration = 4000) => {
    setActiveLocation(location);
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    if (location.bbox) {
        mapRef.current.fitBounds(location.bbox, {
            duration: duration,
            pitch: 45,
            padding: 50
        });
    } else {
        mapRef.current.flyTo({ ...location, duration, essential: true, easing: (t) => t * (2 - t) });
    }

    const filter = ['==', ['get', 'name:en'], location.name_en];
    
    if (timeoutId.current) clearTimeout(timeoutId.current);

    mapRef.current.setFilter('water-highlight-blur', filter);
    mapRef.current.setFilter('water-highlight-main', filter);
    mapRef.current.setPaintProperty('water-highlight-blur', 'line-opacity', 0.8);
    mapRef.current.setPaintProperty('water-highlight-main', 'line-opacity', 1);

    timeoutId.current = setTimeout(() => {
        if (!mapRef.current) return;
        mapRef.current.setPaintProperty('water-highlight-blur', 'line-opacity', 0);
        mapRef.current.setPaintProperty('water-highlight-main', 'line-opacity', 0);
    }, duration + 1000);
  };

  return (
    <PageContainer>
      <SidePanel initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 0.8, ease: [0.6, 0.01, -0.05, 0.9] }}>
        <Header>
          <Title>Карта Рыболова</Title>
          <Subtitle>Интерактивный атлас Туркестанской области</Subtitle>
        </Header>
        <LocationsList>
          {locationsData.map(loc => (
            <LocationButton key={loc.id} onClick={() => flyToLocation(loc)} className={activeLocation.id === loc.id ? 'active' : ''}>
              {loc.name}
            </LocationButton>
          ))}
        </LocationsList>
      </SidePanel>
      <MapArea ref={mapContainerRef} />
    </PageContainer>
  );
};