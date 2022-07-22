let ebiDevOrProd = process.env.INDEX === 'dev' ? 'wwwdev' : 'www';
let facetFields = 'title_value,abstract_value,body_value,journal,year,job_id,manually_annotated';
let fields = 'job_id,title,abstract,abstract_sentence,body_sentence,author,doi,year,journal,pmid,pmcid,cited_by';

module.exports = {
  searchIndex: (ids, query, sort_field, order, start, size) => `https://${ebiDevOrProd}.ebi.ac.uk/ebisearch/ws/rest/rnacentral?query=entry_type:Publication%20AND%20(${ids})${query}&sortfield=${sort_field}&order=${order}&facetfields=${facetFields}&facetcount=50&fields=${fields}&start=${start}&size=${size}&format=json`,
  getMetadata: (primary_id, database) => `https://${ebiDevOrProd}.ebi.ac.uk/ebisearch/ws/rest/rnacentral?query=entry_type:metadata%20AND%20primary_id:${primary_id}%20AND%20database:${database}&fields=job_id&format=json`,
  scannedId:   (job_id) => `https://${ebiDevOrProd}.ebi.ac.uk/ebisearch/ws/rest/rnacentral?query=entry_type:metadata%20AND%20job_id:${job_id}&format=json`,
};