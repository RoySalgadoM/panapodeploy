import React from "react";
import { Col, Form } from "react-bootstrap";
import "../../../src/assets/css/main.css";
import "../../../src/assets/css/util.css";
import "../../../src/assets/css/Styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const FilterComponent = ({ filterText, onFilter, onSearch }) => (
  <>
    <Col md={{ span: 4}}>
      <Form.Group className="mb-3">
        <Form.Label className="font-weight-normal">Buscar:</Form.Label>
        <Form.Control
          id="search"
          type="text"
          placeholder="Buscar"
          aria-label="Buscar..."
          value={filterText}
          onChange={onFilter}
          style={{height: "40px"}}
        />
      </Form.Group>
    </Col>
  </>
);