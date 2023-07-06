import React from 'react';
import {connect} from "react-redux";
import * as actionCreators from 'actions/actions';
import Row from 'react-bootstrap/Row'


class Facets extends React.Component {
  constructor(props) {
    super(props);
    this.renderFacet = this.renderFacet.bind(this);
  }

  renameFacet(facet){
    if (facet==='Title Value') {
      return 'Paper section'
    } else if (facet==='Job ID') {
      return 'Keyword'
    } else if (facet==='Manually annotated') {
      return 'Featured'
    } else if (facet==='Type') {
      return 'Article type'
    } else {
      return facet
    }
  }

  renameFacetValue(facet, facetValue){
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";
    if (facet==='title_value') { facetValue.label = 'Title' }
    if (facet==='abstract_value') { facetValue.label = 'Abstract' }
    if (facet==='body_value') { facetValue.label = 'Main text' }
    if (facet==='manually_annotated' && /^URS/.test(facetValue.label) && this.props.jobIds.find(id => id.toLowerCase() === facetValue.label.toLowerCase())) { facetValue.label = 'Manually annotated' }
    return <a style={{color: linkColor, cursor: 'pointer'}}>{facetValue.label}&nbsp;<small>({facetValue.count})</small></a>
  }

  renderFacet(facet) {
    const database = this.props.database && this.props.database.name ? this.props.database.name.toLowerCase() : "";
    let facetStyle = {
      color: this.props.customStyle && this.props.customStyle.facetColor ? this.props.customStyle.facetColor : "#BF8E3E",
      fontSize: this.props.customStyle && this.props.customStyle.facetSize ? this.props.customStyle.facetSize : "24px",
      fontFamily: "'HelveticaNeueLT Pro','Helvetica Neue',Helvetica,Arial,sans-serif"
    };
    let ulStyle = { overflow: "auto", maxHeight: "15em", marginTop: "-10px" }
    let liStyle = { whiteSpace: "nowrap" }

    // create a list of IDs with no associated articles
    // we want to show all ids in facet
    let idsWithNoResults = ""
    if (facet.label === "Job ID") {
      const getFacetIds = this.props.facets && this.props.facets.find(item => item.id === "job_id");
      let idsWithResults = [];
      getFacetIds && Object.entries(getFacetIds).map(([key, value]) => {
        if (key === "facetValues"){
          idsWithResults = [...idsWithResults, value.map(item => item.label.toLowerCase())]
        }
      })
      idsWithResults = idsWithResults && idsWithResults[0]
      idsWithNoResults = idsWithResults && this.props.jobIds.filter(item => idsWithResults.indexOf(item.toLowerCase()) === -1);
    }

    // check for manually annotated articles
    let showFeaturedLabel = false
    if (database === "rnacentral" && facet.label === "Manually annotated" && showFeaturedLabel === false) {
      if (facet.facetValues.some((facetItem) => this.props.jobIds.some((jobId) => jobId.toLowerCase() === facetItem.value.toLowerCase()))){
        showFeaturedLabel = true
      }
    }

    return [
      facet.label === "Title Value"
      || facet.label === "Year"
      || facet.label === "Journal"
      || facet.label === "Job ID"
      || facet.label === "Organism"
      || facet.label === "Type"
      || (database === "rnacentral" && facet.label === "Manually annotated" && showFeaturedLabel) ? <legend key={`legend-${facet.id}`}>
        <span style={facetStyle}>{ this.renameFacet(facet.label) }</span>
      </legend> : "",
      <ul key={facet.id} className={`list-unstyled ${database !== "rnacentral" && facet.label === "Manually annotated" ? "d-none" : ""}`} style={ ulStyle }>
        {
          facet.facetValues.map(facetValue => (
            facetValue.value !== "False" ? <li style={ liStyle } key={`li ${facetValue.label}`} className={`${facet.label === "Manually annotated" && !this.props.jobIds.some(id => id.toLowerCase() === facetValue.value.toLowerCase()) ? "d-none" : ""}`}>
              <div className="form-check">
                <input className="form-check-input" id={`checkbox-${facet.id}-${facetValue.value}`} type="checkbox"
                  defaultChecked={this.props.selectedFacets.hasOwnProperty(facet.id) && this.props.selectedFacets[facet.id].indexOf(facetValue.value) !== -1}
                  onClick={(e) => {
                    this.props.onToggleFacet(e, facet, facetValue, this.props.jobIds)
                  }}/>
                <label className="form-check-label mt-1" htmlFor={`checkbox-${facet.id}-${facetValue.value}`}>
                  { this.renameFacetValue(facet.id, facetValue) }
                </label>
              </div>
            </li> : ""
          ))
        }
        {
          idsWithNoResults && facet.label === "Job ID" ? idsWithNoResults.map(item => <li style={ liStyle } key={`li ${item}`}>
            <div className="form-check">
              <input className="form-check-input" id={`checkbox-${item}`} type="checkbox" disabled/>
              <label className="form-check-label mt-1" htmlFor={`checkbox-${item}`}>
                {item.startsWith('ens') ? item.toUpperCase() : item } <small>(0)</small>
              </label>
            </div>
          </li>) : ""
        }
        { facet.facetValues.length === 50 ? <small className="text-muted">Showing the top 50 results</small> : "" }
      </ul>
    ];
  }

  render() {
    const hideRnacentral = !!(this.props.customStyle && this.props.customStyle.hideRnacentral);
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";

    return (
      <Row>
        <section>
          <div>
            { this.props.facets.map(facet => this.renderFacet(facet)) }
          </div>
          <small>
            Powered by {hideRnacentral ? "" : <span><a className="custom-link" style={{color: linkColor}} href="https://rnacentral.org" target="_blank">RNAcentral</a>, </span>}<a className="custom-link" style={{color: linkColor}} href="http://www.ebi.ac.uk/ebisearch/" target="_blank">EBI Search</a> and <a className="custom-link" style={{color: linkColor}} href="https://europepmc.org/" target="_blank">Europe PMC</a>
          </small>
        </section>
      </Row>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobIds: state.jobIds,
    status: state.status,
    sequence: state.sequence,
    entries: state.entries,
    facets: state.facets,
    selectedFacets: state.selectedFacets,
    hitCount: state.hitCount,
    ordering: state.ordering,
    textSearchError: state.textSearchError
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onToggleFacet: (event, facet, facetValue, list) => dispatch(actionCreators.onToggleFacet(event, facet, facetValue, list)),
    onSort: (list, event) => dispatch(actionCreators.onSubmitIds(list, event)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Facets);
