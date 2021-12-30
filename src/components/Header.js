import {
  Nav,
  Navbar,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

import { LinkContainer } from 'react-router-bootstrap'

import React from "react";

function Header() {
  return (
      <header>
            <Navbar bg="light" expand="lg" collapseOnSelect>
            <Container >
                <LinkContainer to='/'>
                    <Navbar.Brand><span >Bismi</span></Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: "100px" }}
                    navbarScroll
                >
                    <Form className="d-flex">
                    <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
                </Nav>
                <Nav.Link href="#action1"><i className="fas fa-shopping-cart"></i>&#160;&#160;Cart</Nav.Link>
                    <Nav.Link href="#action2"><i className="fas fa-user"></i>&#160;&#160;Login</Nav.Link>
                </Navbar.Collapse>
            </Container>
            </Navbar>
      </header>
  );
}

export default Header;
