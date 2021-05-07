import React, { Component } from 'react';
import { Route } from "react-router-dom";
import reactProxy from './R109_reactProxy'

// css
import '../css/new.css';

// header
import HeaderAdmin from './Header/Header admin';

// footer
import Footer from './Footer/Footer';

// login
import LoginForm from './LoginForm';

class App extends Component {
  render () {
    return (
      <div className="App">
        <HeaderAdmin/> 
        <Route exact path='/' component={LoginForm} />
        <Route exact path='/reactProxy' component={reactProxy}/>
        <Footer/>
      </div>
    );
  }
}

export default App;