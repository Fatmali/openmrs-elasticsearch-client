"use strict";
const db = require('./config');
const test_db = require('./test-config');
const _ = require('lodash');
const squel = require('squel');
class Dao {

    constructor(){}

   updateLastRunTime(date){
     let formattedDate = this.formatDate(new Date(date));
       return new Promise((resolve,reject) => {
         let query = squel.update().table('etl.flat_elastic_log').set("last_run", formattedDate).where("last_run_id = 1").toString();
         test_db.query(query,(err,results) => {
             if(err){
                 console.error(err);
                 throw(err);
             } else {
                 resolve(formattedDate);
             }
           });
       });
   }

   getLastRunTime(){
     return new Promise((resolve, reject) => {
       let query = squel.select().from("etl.flat_elastic_log").field("last_run").toString();
       test_db.query(query,(err,results) => {
         if(err){
             console.error(err);
             throw(err);
         } else {
             resolve(results[0].last_run);
         }
       });
     });

   }

    getVoidedEncounters() {
        return new Promise((resolve,reject) => {
          this.getLastRunTime().then(datetime => {
            let formattedDate = this.formatDate(new Date(datetime));
            let query = squel.select().from("amrs.encounter").where("voided = 1").where("date_voided > '" + formattedDate+"'").toString();
            db.query(query,(err,results) => {
                   if(err){

                       console.error(err);
                       throw(err);
                   } else {
                       resolve(results);
                   }
               });
          });

        });
    }

   formatDate(date){
      let year = date.getFullYear();
      let month = this.zero(date.getMonth()+1);
      let dt = this.zero(date.getDate());
      let hour = this.zero(date.getHours());
      let minute = this.zero(date.getMinutes());
      let seconds = this.zero(date.getSeconds());
      return year + '-' + month + '-' + dt + ' ' + hour + ':' + minute + ':' + seconds;
    }



zero(number){
  if(number < 10){
    return '0' + number;
  } else {
    return number.toString();
  }
}
}

module.exports = new Dao();
