import React from 'react';
import ReactAdmin from './ReactAdmin';

var configuration = require('./config');
console.log(configuration);
React.render(<ReactAdmin configuration={configuration} />, document.body);
