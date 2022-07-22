import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/actions';
import { Alert, Badge, Button, Card, Col, Row } from "react-bootstrap";
import Facets from 'containers/references/components/Results/components/Facets.jsx'
import Filter from 'containers/references/components/Results/components/Filter.jsx'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'


class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showAbstract: {} }
    this.toggleAbstract = this.toggleAbstract.bind(this);
  }

  // Highlight jobId
  highlights(sentence, jobId){
    let parts = sentence.split(new RegExp(`(${jobId})`, 'gi'));
    return <span style={{ lineHeight: '150%' }}> { parts.map((part, i) =>
        <span key={i} style={part.toLowerCase() === jobId.toLowerCase() ? { fontWeight: 'bold', backgroundColor: '#FFFF99' } : {} }>
            { part }
        </span>)
    } </span>;
  }

  // Show/Hide abstract
  toggleAbstract(entryId) {
    this.setState((prevState) => ({
      ...prevState,
      showAbstract: {
        ...prevState.showAbstract,
        [entryId]: !prevState.showAbstract[entryId]
      }
    }));
  }

  render() {
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const fixCssBtn = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "38px" : "";
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";
    let articleStyle = {
      color: linkColor,
      fontSize: this.props.customStyle && this.props.customStyle.articleTitleSize ? this.props.customStyle.articleTitleSize : "18px",
      textDecoration: 'none',
    }
    let linkStyle = {
      color: linkColor,
      textDecoration: 'none'
    }
    const loadMoreButtonColor = this.props.customStyle && this.props.customStyle.loadMoreButtonColor ? this.props.customStyle.loadMoreButtonColor : "";
    let queryIds = this.props.jobIds.map(id => '"' + id + '"').join(', ');
    queryIds = queryIds.replace(/,/g, '%20OR%20')
    let idsNotScanned = this.props.idsNotScanned.length ? this.props.idsNotScanned.map(id => id).join(', ') : ""
    idsNotScanned = idsNotScanned.replace(/,(?=[^,]*$)/, ' and')

    return (
      <div className="rna">
        {
          this.props.status === "success" && [
            <div key="results">
              {
                this.props.entries && this.props.entries.length || this.props.filter ? <Filter customStyle={ this.props.customStyle } /> : ""
              }
              {
                this.props.entries && this.props.entries.length ? <Row className="mt-3">
                  <Col xs={12} sm={3}>
                    <Facets
                      facets={ this.props.facets }
                      selectedFacets={ this.props.selectedFacets }
                      customStyle={ this.props.customStyle }
                      search={this.props.search}
                      database={this.props.database}
                    />
                  </Col>
                  <Col xs={12} sm={9}>
                    { this.props.entries.map((entry, index) => (
                      <Card className="mb-2" key={`${entry['id']}_${index}`}>
                        <Card.Body>
                          <Card.Text>
                            <a href={`https://doi.org/${entry.fields.doi[0]}`} target="_blank" style={articleStyle}>{ this.highlights(entry.fields.title[0], entry.fields.job_id[0]) }</a>
                          </Card.Text>
                          <Card.Text style={{marginTop: "-10px"}}>
                            <span className="text-muted">
                              { entry.fields.author[0] && entry.fields.author[0].split(";").length > 1 ? entry.fields.author[0].split(";", 1) + " et al.," : entry.fields.author[0] + "," }&nbsp;
                              { entry.fields.journal[0] },&nbsp;
                              { entry.fields.year[0] }.&nbsp;
                              { entry.fields.cited_by[0] > 1 ? "Cited by " + entry.fields.cited_by[0] + " articles." : entry.fields.cited_by[0] === 1 ? "Cited by 1 article." : "" }&nbsp;
                              { entry.fields.pmid[0] ? <span>[<a href={`https://pubmed.ncbi.nlm.nih.gov/${entry.fields.pmcid[0]}`} target="_blank" style={linkStyle}><small>PubMed</small></a>]&nbsp;</span> : "" }
                              { entry.fields.pmcid[0] ? <span>[<a href={`https://europepmc.org/article/PMC/${entry.fields.pmcid[0]}`} target="_blank" style={linkStyle}><small>Europe PMC</small></a>]</span> : "" }
                            </span>
                          </Card.Text>
                          <Card.Text>
                            <i>
                              {
                                'abstract_value' in this.props.selectedFacets && entry.fields.abstract_sentence[0] ? this.highlights(entry.fields.abstract_sentence[0], entry.fields.job_id[0])
                                : 'body_value' in this.props.selectedFacets && entry.fields.body_sentence[0] ? this.highlights(entry.fields.body_sentence[0], entry.fields.job_id[0])
                                : entry.fields.abstract_sentence[0] ? this.highlights(entry.fields.abstract_sentence[0], entry.fields.job_id[0])
                                : entry.fields.body_sentence[0] ? this.highlights(entry.fields.body_sentence[0], entry.fields.job_id[0])
                                : ""
                              }</i>&nbsp;&nbsp;
                            <Badge bg="secondary">
                              {
                                'abstract_value' in this.props.selectedFacets && entry.fields.abstract_sentence[0] ? "Abstract"
                                : 'body_value' in this.props.selectedFacets && entry.fields.body_sentence[0] ? "Main text"
                                : entry.fields.abstract_sentence[0] ? "Abstract"
                                : entry.fields.body_sentence[0] ? "Main text"
                                : ""
                              }
                            </Badge>
                            <br/><br/>
                            <a style={linkStyle} className="mt-5" key={`abstract_${entry['id']}_${index}`} onClick={() => this.toggleAbstract(entry['id'])}>
                              { this.state.showAbstract[entry['id']] ? <span><MdExpandLess /> Hide abstract</span> : <span><MdExpandMore /> View abstract</span> }
                            </a>
                            { this.state.showAbstract[entry['id']] ? <span><br/><br/>{this.highlights(entry.fields.abstract[0], entry.fields.job_id[0])}</span> : '' }
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                    {
                      this.props.loadMoreStatus === "error" ? <Alert variant="danger">
                        <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                          There was an error. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/rnacentral-litscan/issues" target="_blank">GitHub</a>.
                        </p>
                      </Alert>
                      : this.props.entries.length < this.props.hitCount ? <Button variant="secondary" onClick={(e) => { this.props.onLoadMore(this.props.jobIds, e) }} style={{background: loadMoreButtonColor, borderColor: loadMoreButtonColor, fontSize: fixCss, height: fixCssBtn}}>{this.props.loadMoreStatus !== "loading" ? "Load more" : "Loading..."}</Button> : ""
                    }
                  </Col>
                </Row> : this.props.idsNotScanned.length ? <Row>
                  <Col xs={12} sm={12} className="mt-3">
                    <Alert variant="warning">
                      <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                        {idsNotScanned} {this.props.idsNotScanned.length > 1? "have" : "has"} not yet been scanned by LitScan, but you can try searching in <a href={`https://europepmc.org/search?query=${queryIds}`} target="_blank">Europe PMC</a>
                      </p>
                    </Alert>
                  </Col>
                </Row> : this.props.filter ? <Row>
                  <Col xs={12} sm={12} className="mt-3">
                    <Alert variant="warning">
                      <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                        Your search - <strong>{this.props.filter}</strong> - did not match any articles
                      </p>
                    </Alert>
                  </Col>
                </Row> : <Row>
                  <Col xs={12} sm={12} className="mt-3">
                    <Alert variant="warning">
                      <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                        No open access articles were found. Try searching the latest literature in <a href={`https://europepmc.org/search?query=${queryIds}`} target="_blank">Europe PMC</a>
                      </p>
                    </Alert>
                  </Col>
                </Row>
              }
            </div>
          ]
        }
        {
          this.props.status === "error" && (
            <Row>
              <Col>
                <Alert variant="danger">
                  <p className="text-muted mt-3" style={{fontSize: fixCss}}>
                    There was an error. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/rnacentral-genes/issues" target="_blank">GitHub</a>.
                  </p>
                </Alert>
              </Col>
            </Row>
          )
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobIds: state.jobIds,
    idsNotScanned: state.idsNotScanned,
    status: state.status,
    hitCount: state.hitCount,
    entries: state.entries,
    facets: state.facets,
    selectedFacets: state.selectedFacets,
    loadMoreStatus: state.loadMoreStatus,
    filter: state.filter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoadMore: (list, event) => dispatch(actionCreators.onLoadMore(list)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
