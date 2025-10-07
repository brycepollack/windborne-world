'use client';
import React, { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import InfoComponent from '@/components/InfoComponent';
import ControlComponent from '@/components/ControlComponent';
import HeaderComponent from '@/components/HeaderComponent';
import FooterComponent from '@/components/FooterComponent';
import { Config } from '@/types/config';

export default function Home() {
  const [config, setConfig] = useState<Config>({
    showTrails: false,
    showIds: false,
    idSize: 6,
    balloonSize: 3,
    infoType: 'by-country',
  });

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-[#dae0d3] to-white">
      <HeaderComponent />

      {/* Control bar */}
      <div className="w-full bg-gradient-to-r from-[#dae0d3] to-white flex justify-center py-3">
        <div className="flex flex-col gap-3 bg-white rounded-md shadow-sm p-3">
          <ControlComponent config={config} setConfig={setConfig} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="flex w-[90%] max-w-[1200px] h-[500px] bg-gradient-to-br from-white to-[#dae0d3] border-4 border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {/* Map panel */}
          <div className="flex-[3] h-full">
            <MapComponent config={config} />
          </div>

          {/* Info panel */}
          <div className="flex-[1] h-full p-4 overflow-y-auto">
            <InfoComponent config={config} />
          </div>
        </div>
      </div>

      <FooterComponent />
    </main>
  );
}
