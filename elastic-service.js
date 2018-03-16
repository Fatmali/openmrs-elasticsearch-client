"use strict";
const elasticsearch = require('elasticsearch')
const _ = require('lodash');
const Promise = require('bluebird');
const esClient = new elasticsearch.Client({
    host: [
    {
      host: 'http://XX.XX.XX.XX:9200',
      auth: 'XXXXX',
      protocol: 'XXXX',
      port: XXXX,
      log: 'trace'
    }
  ],
    maxRetries: 10,
});
class ElasticSearchService {

    constructor(){}

    getDocumentsWithVoidedEncounters(encounters) {
        return esClient.msearch(this.buildMultiSearchObject(encounters));
    }


    buildMultiSearchObject(encounters){
      let body = [];
      _.forEach(encounters, (encounter) => {
        body.push({ index: 'jdbc_hiv_monthly_report_dataset'},
                  {"query": {
                      "bool": {
                        "should": [
                          { "match": { "patient_id":  encounter.patient_id }},
                          { "match": { "encounter_datetime": encounter.encounter_datetime   }}
                        ]
                      }
                    }
                  });
      });
      console.log(body);
      return {body};
    }

    getVoidedElasticIds(documents) {
        let elastic_ids = [];
         _.forEach(documents, (document) => {
           console.error(JSON.stringify(document, null, '\t'));
                if(document.hits.total > 0) {
                  elastic_ids.push(document.hits.hits[0]._id);
                }
            });
        return elastic_ids;
    }

    deleteVoidedEncounters(elastic_ids) {
        return new Promise((resolve, reject) => {
            resolve(esClient.bulk(this.buildBulkDeleteObject(elastic_ids)));
        });
    }

    buildBulkDeleteObject(elastic_ids) {
        let body = [];
        _.forEach(elastic_ids, (id) => {
                   body.push({ "delete" : { "_index" : "jdbc_hiv_monthly_report_dataset", "_type" : "doc", "_id" : id } });
        });
        return {body: body};
    }
}

module.exports = new ElasticSearchService();
