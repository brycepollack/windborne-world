import React from 'react';

export default function FooterComponent() {
  return (
    <footer className="bg-[#161616] text-gray-300 py-8 px-8 shadow-inner">
      <div className="max-w-4xl mx-auto flex flex-col gap-4 text-center">
        <h1 className="text-3xl font-extrabold text-white">What is WindBorne World?</h1>

        <p className="text-base">
          WindBorne World visualizes 24 hours of flight data from 1,000 balloons in the WindBorne
          constellation. Data is provided via the{' '}
          <a
            href="https://a.windbornesystems.com/treasure/00.json"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            WindBorne Systems Treasure API
          </a>{' '}
          and displayed on a world map using{' '}
          <a
            href="https://geojson-maps.kyd.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GeoJSON basemaps
          </a>
          .
        </p>

        <p className="text-base">
          <a
            href="https://windbornesystems.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            WindBorne Systems
          </a>{' '}
          operates a constellation of long-duration weather balloons being used to build{' '}
          <strong>WeatherMesh</strong>, a record-breaking AI-powered weather forecasting model.
        </p>

        <p className="text-base">
          Created by{' '}
          <a
            href="https://brycepo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Bryce Pollack
          </a>
          .{' '}
          <a
            href="https://github.com/brycepollack/windborne-world"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Source code available on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
