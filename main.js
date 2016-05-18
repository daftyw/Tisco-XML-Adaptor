var fs = require('fs');
var unirest = require('unirest');
var xml2js = require('xml2js');
var builder = new xml2js.Builder();
var url = 'http://tisco-poc-data-api.au.cloudhub.io/query';

var jsonParam = { 
  'action_role' : 'DEVELOPMENT',
  'dataset_name' : '1-3-1_POC',
  'request_data' : { 
    '$' : { 
	  'field' : '20-POC20',
	  'value' : '180',
	  'function' : 'eq'
	}
  }	
};

console.log('request = ' + JSON.stringify(jsonParam));  
  
  

// call service
unirest.post(url)
  .type('json')
  .send(jsonParam)
  .end(function (res) {
	 var json = res.body;
	 if(json.msg_code < 0) {
       console.log('Error: ' +json.msg_detail );
	 } else {
		 
		 var out = '<?xml version="1.0"> <documents>';
		 console.log('Success: ' + json.msg_detail);
		 var data = json.response_data ;
		 
		 for(var i = 0 ; i < data.length; i++) {
			 out = out + '<Document>' +
			   builder.buildObject(data[i]);			 
			 '</Document>';
			 
		 }
		 
		 out = out + '</documents>';
	 }
  });