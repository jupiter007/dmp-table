import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';

import Header from './components/Header.jsx';
import FlashMessages from './components/FlashMessages.jsx';
import Dashboard from './components/Dashboard/index.jsx';
import Footer from './components/Footer.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import './App.css';

//context
import StateContext from './StateContext.js';
import DispatchContext from './DispatchContext.js';

function App() {
  const initialState = {
    flashMessages: [],
    errors: [],
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'flashMessage':
        draft.flashMessages.push(action.value);
        break;
      case 'setErrors':
        if (!draft.errors.includes(action.value)) {
          draft.errors.push(action.value);
        }
        break;
      case 'removeErrors':
        draft.errors = [];
        break;
      default:
        return draft;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages />
          <Header />
          {state.errors.length > 0 && <ErrorMessage messages={state.errors} />}
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
