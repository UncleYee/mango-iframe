import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import $script from 'scriptjs';

export function external(window: Window & { [key: string]: any}) {
  window._ = _
  window.React = React
  window.ReactDOM = ReactDOM
  window.$script = $script
};
