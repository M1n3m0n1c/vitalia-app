"use client";

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const LeafletMap = dynamic(() => import('../../../components/facial/LeafletFaceMap'), { ssr: false });

export default function LeafletFaceTestPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LeafletMap />
    </div>
  );
} 