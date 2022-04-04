import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '/src/actions/actions';
import {store} from "/src/app.jsx";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { MdHelpOutline } from 'react-icons/md'


class Search extends React.Component {
  searchIds(list, database) {
    store.dispatch(actionCreators.getIdsNotScanned(list));

    if (database) {
      store.dispatch(actionCreators.getRelatedIds(list, database));
    } else {
      store.dispatch(actionCreators.onSubmitIds(list));
    }
  }

  render() {
    const database = this.props.database && this.props.database.name ? this.props.database.name : "";
    const titleText = this.props.customStyle && this.props.customStyle.titleText ? this.props.customStyle.titleText : "Open Access Publications";
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const titleStyle = {
      color: this.props.customStyle && this.props.customStyle.titleColor ? this.props.customStyle.titleColor : "#BF8E3E",
      fontSize: this.props.customStyle && this.props.customStyle.titleSize ? this.props.customStyle.titleSize : "30px",
      fontFamily: "'HelveticaNeueLT Pro','Helvetica Neue',Helvetica,Arial,sans-serif"
    };
    const small = { fontSize: "65%" }
    return (
      <Container>
        <div className="rna">
          <Row>
            <Col xs={12} sm={12} className="mb-3">
              <span style={titleStyle}>{titleText} { this.props.status === "running" ? <span className={`text-muted spinner-border ${fixCss ? '' : 'spinner-border-sm'}`} style={small} role="status" aria-hidden="true"></span> : this.props.status !== "notSubmitted" ? <small className="text-muted" style={small}>{this.props.hitCount} total <a className="text-muted" style={{verticalAlign: "10%"}} href="https://rnacentral.org/help/litscan" target="_blank"> <MdHelpOutline /></a></small> : "" }</span>
            </Col>
          </Row>
          {
            !this.props.search || !this.props.search.length ? <Row>
                <Col xs={12} sm={12} className="mb-3">
                  <Alert variant="warning">
                    <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                      You need to pass a list of ids as a variable, e.g. search='["id1", "id2"]'
                    </p>
                  </Alert>
                </Col>
              </Row> : this.props.status === "notSubmitted" ? this.searchIds(this.props.search, database) : ""
          }
        </div>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  status: state.status,
  hitCount: state.hitCount
});

export default connect(
  mapStateToProps,
)(Search);
