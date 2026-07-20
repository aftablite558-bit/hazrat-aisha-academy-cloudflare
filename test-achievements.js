import React from 'react';
import { renderToString } from 'react-dom/server';
import { Achievements } from './src/pages/dashboard/content/Achievements';

try {
  console.log(renderToString(React.createElement(Achievements)));
} catch (e) {
  console.log('CRASH!', e);
}
