import React from 'react';
import { renderToString } from 'react-dom/server';
import { Attendance } from './src/pages/dashboard/academic/Attendance.tsx';

try {
  const html = renderToString(React.createElement(Attendance));
  console.log('SUCCESS:', html.substring(0, 200));
} catch (e) {
  console.error('ERROR:', e);
}
