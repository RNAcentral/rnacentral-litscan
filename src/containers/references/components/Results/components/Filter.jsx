import React from 'react';
import {connect} from "react-redux";
import * as actionCreators from 'actions/actions';
import {store} from "app.jsx";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";


class Filter extends React.Component {
  constructor(props) {
    super(props);
  }

  onFilterSubmit(event) {
    event.preventDefault();
    const state = store.getState();
    if (state.filter) {
      store.dispatch(actionCreators.onSubmitIds(state.jobIds));
    }
  }

  onFilterReset(event) {
    event.preventDefault();
    const state = store.getState();
    if (state.filter) {
      store.dispatch(actionCreators.onFilterChange(""));
      store.dispatch(actionCreators.onSubmitIds(state.jobIds));
    }
  }

  render() {
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    return (
      <Row>
        <Col xs={12} sm={3}>
          <Form.Select style={{fontSize: fixCss}} onChange={(e) => { this.props.onSort(this.props.jobIds, e.target.value) }}>
            <option value="score:descending">Sort by score - default</option>
            <option value="cited_by:descending">Sort by citation</option>
            <option value="year:descending">Sort by year (descending)</option>
            <option value="year:ascending">Sort by year (ascending)</option>
          </Form.Select>
        </Col>
        <Col xs={8} sm={5}>
          <Form onSubmit={(e) => this.onFilterSubmit(e)} onReset={(e) => this.onFilterReset(e)}>
            <InputGroup>
              <Form.Control type="text" value={this.props.filter} onChange={(e) => this.props.onFilterChange(e)} placeholder="Text search within results" style={{fontSize: fixCss}} />
              <Button type="submit" variant="outline-secondary" style={{fontSize: fixCss}}>Filter</Button>
              <Button type="reset" variant="outline-secondary" style={{fontSize: fixCss}}>Clear</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobIds: state.jobIds,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSort: (list, event) => dispatch(actionCreators.onSubmitIds(list, event)),
    onFilterChange: (event) => dispatch(actionCreators.onFilterChange(event.target.value)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
