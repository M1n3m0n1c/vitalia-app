"use client";

import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';

const imageUrl = '/imagem-face.png';
const bounds: L.LatLngBoundsExpression = [[0, 0], [1000, 1000]];

export default function LeafletFaceMap() {
  return (
    <MapContainer
      center={[500, 500]}
      zoom={1}
      minZoom={1}
      maxZoom={4}
      style={{ height: '100vh', width: '100vw', background: '#fff' }}
      crs={L.CRS.Simple}
      scrollWheelZoom={true}
    >
      <ImageOverlay url={imageUrl} bounds={bounds} />
    </MapContainer>
  );
} 