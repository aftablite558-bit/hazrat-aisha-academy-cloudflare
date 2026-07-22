import React, { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { Routes, Route, MemoryRouter } from 'react-router-dom';

const Good = () => React.createElement('div', null, 'Good');
const Bad = React.lazy(() => Promise.resolve({ default: undefined }));

const App = () => React.createElement(MemoryRouter, { initialEntries: ['/'] }, 
  React.createElement(Suspense, { fallback: 'Loading' }, 
    React.createElement(Routes, null, 
      React.createElement(Route, { path: '/', element: React.createElement(Good) }),
      React.createElement(Route, { path: '/bad', element: React.createElement(Bad) })
    )
  )
);

try {
  console.log(renderToString(React.createElement(App)));
} catch (e) {
  console.log('CRASH!', e);
}
