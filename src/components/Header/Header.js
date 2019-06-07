import React from 'react';
import axios from 'axios';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import logo from '../../assets/images/logo-white.png';
import authHeader from '../../_helpers/auth-header';
import VolunteerHeader from './VolunteerHeaderNav';
import AdminHeader from './AdminHeader';
import utils from '../../_helpers/utils';

class Header extends React.Component {
  state = {
    nameSuccess: false, // Indicates if the name GET has been successful
    firstName: '',
    adminMessage: ''
  };

  componentDidMount() {
    // Retrieve name from uid
    const { uid, isAdmin } = JSON.parse(localStorage.getItem('user'));

    const config = {
      headers: authHeader(),
      params: {
        id: uid
      }
    };

    axios
      .get(`/users/${uid}`, config)
      .then(utils.handleResponse)
      .then(data =>
        this.setState({
          firstName: data.firstName,
          nameSuccess: true,
          adminMessage: isAdmin ? '(Admin)' : '(Volunteer)'
        })
      )
      .catch(utils.catchResponse);
  }

  render() {
    const { isAdmin } = JSON.parse(localStorage.getItem('user'));
    const { nameSuccess, firstName, adminMessage } = this.state;
    let nameMessage = null;

    if (nameSuccess) {
      nameMessage = `Logged in as ${firstName} ${adminMessage}`;
    }

    return (
      <Navbar variant="dark" bg="primary" expand="lg">
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src={logo}
              width="100"
              alt="Mobilise logo"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {isAdmin ? <AdminHeader /> : <VolunteerHeader />}
          </Nav>
          <Navbar.Text className="mr-sm-2">{nameMessage}</Navbar.Text>
          {/* Settings dropdown */}
          <NavDropdown
            alignRight
            title={<FontAwesomeIcon icon={faCog} />}
            className="mr-sm-2"
          >
            <LinkContainer to="profile">
              <NavDropdown.Item>Profile</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="settings">
              <NavDropdown.Item>Settings</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/help/feedback">
              <NavDropdown.Item>Give Feedback</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            <LinkContainer to="login">
              <NavDropdown.Item>Sign out</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
