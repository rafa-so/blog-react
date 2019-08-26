import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import New from './components/New';

import firebase from './firebase';

import './global.css';

export default class App extends Component {

  state = {
    firebaseInitializaded: false
  };

  componentDidMount(){
    firebase.isInitialized().then(resultado => {
      this.setState({ firebaseInitializaded: resultado });
    });
  }

  render(){
    return this.state.firebaseInitializaded !== false ? (
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={ Home } />
          <Route exact path="/login" component={ Login } />
          <Route exact path="/dashboard" component={ Dashboard } />
          <Route exact path="/dashboard/new" component={ New } />
          <Route exact path="/register" component={ Register } />
        </Switch>
      </BrowserRouter>
    ) : (
      <h1>Carregando...</h1>
    );
  }
}