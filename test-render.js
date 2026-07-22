import React from 'react';
import { renderToString } from 'react-dom/server';
import { Achievements } from './src/pages/dashboard/content/Achievements.tsx';

try {
  const html = renderToString(React.createElement(Achievements));
  console.log('SUCCESS:', html);
} catch (e) {
  console.error('ERROR:', e);
}
