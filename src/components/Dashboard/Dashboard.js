import React from 'react';
import {
     Container, Row, Col, UncontrolledAlert, Button
  } from 'reactstrap';
import UserCard from '../UserCard/UserCard';
import UserCreatedStreams from '../UserCreatedStreams/UserCreatedStreams';
import UserSavedStreams from '../UserSavedStreams/UserSavedStreams';
import {Link} from 'react-router-dom';

  class Dashboard extends React.Component{
    constructor(props) {
    super(props);
    this.state = { 
     favs:[],
     owned:[],  
     };
  }
  user = this.props.user;

//fetches the favorite streams data of the authenticated user
fetchFavs = () => {
  fetch('https://fierce-fortress-43881.herokuapp.com/saved_streams', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userid: this.user.id })
    })
      .then(response=> response.json())
      .then(favs => this.setState({favs : favs}));  
} 

//fetches the streams created data by the authenticated user
fetchOwnedStreams = () => {
  this.props.fetchStreams();
  fetch('https://fierce-fortress-43881.herokuapp.com/owned_streams', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userid: this.user.id })
    })
      .then(response=> response.json())
      .then(owned => this.setState({owned : owned}));  
} 

componentDidMount = () => {
  this.fetchFavs();
  this.fetchOwnedStreams();
}

render(){
const favs = this.state.favs;
const owned = this.state.owned;
        return (
            <div>
            <Container>
          <Row>
          <Col lg='4' md='6'>
          <UserCard name={this.user.name} bio= {this.user.bio} photo= {this.user.photo}/>
          <hr/>
          <p style={{textAlign:'left'}}>Email: {this.user.email}</p>
          <Link to="/settings">
                    <Button color='primary' block>Settings</Button>
                </Link>  
            </Col>
          <Col lg='8' md='6'>
              <UncontrolledAlert color="success" style={{marginTop:'20px'}}>
              <h4 className="alert-heading">Welcome to your dashboard!</h4>
      <p style={{textAlign:'left'}}>Here, you can watch your saved streams and edit or delete your created streams!</p>
      <hr />
      <p className="mb-0" style={{textAlign:'left'}}>
          Tip: Adding a bio helps the UniVRestiy community to get to know you better.  
        </p>
    </UncontrolledAlert>
    <br/>
    <h4 style={{textAlign:'left' , marginRight:'100px'}}>Saved Streams</h4>
    <hr/>
            {favs.map((fav, i) => {
              return (
            <UserSavedStreams userid= {this.user.id} removeFav={this.fetchFavs}
              key= {i}
              title={favs[i].title} 
              headline={favs[i].headline} 
              url={favs[i].url}
            />
            );
          })}

    <br/>
    <h4 style={{textAlign:'left'}}>Created Streams</h4>
    <hr />
          {owned.map((own, i) => {
              return (
            <UserCreatedStreams userid= {this.user.id} removeDeleted={this.fetchOwnedStreams} removeFav={this.fetchFavs}
              key= {i}
              title={owned[i].title} 
              headline={owned[i].headline} 
              url={owned[i].url}
              photo={owned[i].photo}
            />
            );
          })}

    </Col>
    </Row>
            </Container>
          </div>
         
        );
     } 
    }
    
  
  
  export default Dashboard;