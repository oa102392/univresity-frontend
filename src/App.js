import React, { Component } from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';
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
import Stream from './components/Stream/Stream';

//PrivateRoute component. Checks if the user isSignedIn. If yes, it renders the “component” prop. If not, it redirects the user to /login.
const AuthRoute = ({ component: Component, user, isSignedIn, loadStream, fetchStreams, ...rest }) => (
  <Route {...rest} render={(props) => (
    isSignedIn === true
      ? <Component {...props} user={user} isSignedIn = {isSignedIn} loadStream={loadStream} fetchStreams={fetchStreams} />
      : <Redirect to='/login'/>
  )} />
);


class App extends Component {
    constructor() {
      super();
      this.state = {
        isSignedIn: false,
        streams: [],
        searchfield: '',
        user: {
          id: '',
          name: '',
          email: '',
          joined: '',
          bio: '',
          photo: ''
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
      photo: data.photo,
    }})
  }

  loadStream = (data) => {
    this.fetchStreams();
    this.setState({stream: {
      title: data.title,
      subject: data.subject,
      headline: data.headline,
      description: data.description, 
      owner: data.owner
    }})
  }

    fetchStreams = () =>{
      fetch('https://fierce-fortress-43881.herokuapp.com/public_streams')
      .then(response=> response.json())
      .then(streams => this.setState({streams : streams}));  
    }
  
    //Immediately after a component is mounted the function invokes fetchStreams that gets the stream data from the back-end server
    componentDidMount(){
      this.fetchStreams();
    }

    //updates the state of the searchfield when the user types in the searchbox
    onSearchChange = (event) => {
      this.setState({ searchfield: event.target.value })
    }
  
    //sets the isSignedIn value to true or false if the user is signed in or not
    auth = (isAuth) => {
      if (isAuth) {
        this.setState({isSignedIn: true})
      } else {
        this.setState({isSignedIn: false})
      } 
    }

    render() {
      const filteredStreams  = this.state.streams.filter(stream => {
        return stream.title.toLowerCase().includes(this.state.searchfield.toLowerCase())
      })
      const { isSignedIn, user } = this.state;
      return (
        <HashRouter >
        <div className="App"> 
      <Navigation isSignedIn={isSignedIn} 
      name={user.name} photo={user.photo}
      />
         <Switch>
            <Route exact path='/' render={() => (
              <div>
              <Searchbar searchChange={this.onSearchChange}/>
              <CardList streams = {filteredStreams} isSignedIn={isSignedIn} userid={user.id}/>
              </div>
            )}/>
            <Route path='/register' render={() => (
              <Register loadUser={this.loadUser} auth={this.auth}/>
            )}/>
            <Route path='/login' isSignedIn={isSignedIn} render={() => (
              <Login loadUser={this.loadUser} auth={this.auth}/>
            )}/>
            <AuthRoute path='/createstream' loadStream={this.loadStream} isSignedIn={isSignedIn} user={user} component={CreateStream}/>
            <AuthRoute path='/dashboard' user={user} isSignedIn={isSignedIn} fetchStreams={this.fetchStreams} component={Dashboard} />
            <AuthRoute path='/settings' user={user} isSignedIn={isSignedIn} component={Settings} />
            <Route path ='/stream/' isSignedIn={this.isSignedIn} component={Stream} />
            <Route isSignedIn={this.isSignedIn} component={Error} />
            
            </Switch>
        </div>
        </HashRouter>
        
      );
    }
  }


export default App;