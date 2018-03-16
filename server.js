'use strict';
const Glue = require('glue');
const Manifest = require('./manifest');
const dao = require('./dao');
const elasticsearchService = require('./elastic-service');
const composeOptions = {relativeTo: __dirname};
const Composer = Glue.compose.bind(Glue, Manifest.get('/'), composeOptions);
const Promise = require('bluebird');
var fs = require('fs')
 , Logger = require('log')
 , logr = new Logger('info', fs.createWriteStream('logs.log'));


function log(message,consolelog){
  var msg = "\n ---------------------------" + message.toUpperCase() + "------------------------------ \n"
  logr.info(msg);
  if(consolelog){
    console.log(msg);
  }
}


function checkAndDeleteVoidedEncounters(){
  return new Promise((resolve, reject) => {
    dao.getVoidedEncounters().then(encounters => {
      log("Fetching Voided Encounters: \n" + JSON.stringify(encounters,null,'\t'),false);
      if(encounters.length > 0) {
        elasticsearchService.getDocumentsWithVoidedEncounters(encounters).then((documents) => {
                    var elasticIds = elasticsearchService.getVoidedElasticIds(documents.responses);
                    log("Documents With Voided Encounters" + JSON.stringify(documents,null,'\t'),false);
                    log('The following elastic ids belong to voided encounters:' + elasticIds,false);
                    if(elasticIds.length > 0){
                       elasticsearchService.deleteVoidedEncounters(elasticIds)
                         .then((success) => resolve("SUCCESS: DELETED VOIDED ENCOUNTERS FROM ELASTIC SEARCH!"));
                    } else {
                      resolve("PROCESS FINISHED: NO DOCUMENTS WERE DELETED: REASON: DOCUMENTS WERE NON_EXISTANT IN ES OR NO ENCOUNTERS WERE VOIDED TODAY.");
                   }
                  });
      } else {
        resolve("NO VOIDED ENCOUNTERS TODAY!");
      }});
  });

}


function updateLastRunTime(date) {
    return dao.updateLastRunTime(date)

}


Composer((err, server) => {
    if (err) {
                throw err;
     }
   server.start((error) => {
                if (error) {
                    throw error;
                }
                log('Started the server on port ' + server.info.uri,true);
                checkAndDeleteVoidedEncounters().then((results) => {
                  log(results,true);
                  var now = Date.now();
                  updateLastRunTime(new Date(now).toISOString()).then((res) => {
                    log("UPDATED LAST RUN TIME ------------- " + res,true);
                    process.exit(0);
                  });
                });

        });
        });


