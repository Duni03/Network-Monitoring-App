import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Sidenavi() {
  const history = useNavigate();

  const out = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("Email");
    localStorage.removeItem("name");
    axios.defaults.headers.common["id"] = null;
    axios.post("http://localhost:3001/logout").then((res) => {
      console.log(res.data);
    });
    history("/login");
  };

  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/home">TEAM 3</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "50px" }}
              navbarScroll
            >
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/machine">Machine</Nav.Link>
              <Nav.Link href="/domain">Domain</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={localStorage.getItem("name")} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/password">
                  New Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={out}>LOGOUT</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

export default Sidenavi;
