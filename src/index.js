import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import MainContainer from './components/MainContainer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MainContainer />, document.getElementById('root'));
registerServiceWorker();
