import React from 'react';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import Orders from './components/Orders/OrdersTable.js';

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Orders />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
