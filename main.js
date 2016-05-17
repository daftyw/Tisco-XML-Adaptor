var fs = require('fs');
var unirest = require('unirest');
var url = 'http://10.242.12.207:8080/dep-api/query';

var jsonParam = { 
  'action_role' : 'DEVELOPMENT',
  'dataset_name' : '1-3-1_POC',
  'request_data' : { 
    '$' : { 
	  'field' : '20-POC20',
	  'function' : 'eq',
	  'value' : '200'
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
	 console.log(json);
  });