import React, { Component } from 'react';
import { Router, BrowserRouter, Route, Switch, Redirect, withRouter, Link } from 'react-router-dom';
import Login from './components/Login/Login';
import Navigation from './components/Navigation/Navigation';
import Register from './components/Register/Register';
import CardList from './components/CardList/CardList';
import Searchbar from './components/Searchbar/Searchbar';
import './App.css';
import './components/Login/Login.css';
import './components/Navigation/Navigation.css';
import './components/CardView/CardView.css';
//import {streams} from './streams';
import CreateStream from './components/CreateStream/CreateStream';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Settings/Settings';
import Error from './components/Error/Error';
import history from './history';
import { AuthRoute } from 'react-router-auth'




class App extends Component {
    constructor() {
      super();
      this.state = {
        route: '/',
        isSignedIn: false,
        streams: [],
        searchfield: '',
        user: {
          id: '',
          name: '',
          email: '',
          joined: '',
          bio: ''
        }
      }
    }

    loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      bio: data.bio,
      joined: data.joined,
    }})
  }

  loadStream = (data) => {
    this.setState({stream: {
      title: data.title,
      subject: data.subject,
      headline: data.headline,
      description: data.description
    }})
  }


    componentDidMount(){
      fetch('http://localhost:3000/public_streams')
      .then(response=> response.json())
      .then(streams => this.setState({streams : streams}));  
    }
  
    onSearchChange = (event) => {
      this.setState({ searchfield: event.target.value })
    }
  
    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState({isSignedIn: false})
        route = '/';
      } else if (route === '/') {
        this.setState({isSignedIn: true})
      } 
      this.setState({route: route});
    }

    render() {
      const filteredStreams  = this.state.streams.filter(stream => {
        return stream.title.toLowerCase().includes(this.state.searchfield.toLowerCase())
      })

      const { isSignedIn, route } = this.state;
      return (
        <Router history={history}>
        <div className="App"> 
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}
      name={this.state.user.name}
      />
         <Switch>
            <Route exact path='/' render={() => (
              <div>
              <Searchbar searchChange={this.onSearchChange}/>
              <CardList streams = {filteredStreams}/>
              </div>
            )}/>
            <Route path='/register' render={() => (
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )}/>
            <Route path='/login' isSignedIn={isSignedIn} render={() => (
              <Login loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )}/>
            <AuthRoute authenticated={isSignedIn} loadUser={this.loadUser} path="/createstream" component={CreateStream} redirectTo="/login"/>

            <AuthRoute path='/dashboard' loadUser={this.loadUser} name={this.state.user.name} bio={this.state.user.bio} authenticated={isSignedIn} component={Dashboard} redirectTo="/login" 
            />
            <AuthRoute authenticated={isSignedIn} loadUser={this.loadUser}path='/settings' component={Settings} redirectTo="/login"/>
            <Route path='/signout' />
            <Route component={Error} />
            
            </Switch>
        </div>
        </Router>
        
      );
    }
  }


export default App;