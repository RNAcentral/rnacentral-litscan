import React from 'react';
import {connect} from "react-redux";

import Search from "/src/containers/references/components/Search/index.jsx";
import Results from "/src/containers/references/components/Results/index.jsx";


class References extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return [
      <Search
          key={`search`}
          customStyle={this.props.customStyle}
          search={this.props.search}
          database={this.props.database}
      />,
      <Results
          key={`results`}
          customStyle={this.props.customStyle}
          search={this.props.search}
          database={this.props.database}
      />
    ]
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(References);
