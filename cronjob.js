var cronjob = require('cron').CronJob;

new cronjob('00 00 20 * * *', function() {
   console.log(" ELASTICSEARCH CRON JOB STARTED ");
   var exec = require('child_process').exec;
   exec('node server.js', (err, stdout, stderr) => {
   if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  });
}, function(){
console.log("ELASTICSEARCH CRON JOB FINISHED!");

}, true, 'Africa/Nairobi');


