import React from 'react';
import { renderToString } from 'react-dom/server';

const MySelect = ({ ...props }) => {
  return React.createElement('select', props, React.createElement('option', null, 'Hi'));
};

try {
  renderToString(React.createElement(MySelect, { children: React.createElement('option', null, 'Bye') }));
} catch (e) {
  console.log('CRASH!', e.message);
}
