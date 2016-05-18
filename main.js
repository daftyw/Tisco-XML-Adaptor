var fs = require('fs');
var unirest = require('unirest');
var xml2js = require('xml2js');

var param_gender;
var param_title;
var param_country;

function callingMain() {
    console.log("Main Service ===");
    // call service
    var url = 'http://tisco-poc-data-api.au.cloudhub.io/query';

    var jsonParam = {
        'action_role': 'DEVELOPMENT',
        'dataset_name': '1-3-1_POC',
        'request_data': {
            '$': {
                'field': '20-POC20',
                'value': 199,
                'function': 'eq'
            }
        }
    };

    console.log('Request:\n' + JSON.stringify(jsonParam));

    unirest.post(url)
        .type('json')
        .send(jsonParam)
        .end(function (res) {
            var json = res.body;
            if (json.msg_code < 0) {

                console.log('Response:\n' + JSON.stringify(json));
                console.log('\nError: ' + json.msg_detail);

            } else {
                console.log('Output:\n\n');

                var out = '<?xml version="1.0" encoding="UTF-8"?>\n<documents>';
                console.log('Success: ' + json.msg_detail);
                var data = json.response_data;

                for (var i = 0; i < data.length; i++) {
                    var e = data[i];
                    out = out
                            // HEADER PART
                        + '<DOCUMENT>\n'
                        + '<DREREFERENCE>' + e["4-POC4"] + '</DREREFERENCE>\n'
                        + '<DREDBNAME>dbDataAPI</DREDBNAME>\n'
                        + '<DREDATE>' + e["102-90003"] + '</DREDATE>\n'
                        + '<DRETITLE>' + e["4-POC4"] + '</DRETITLE>\n'
                        + '<DRECONTENT>' + e["4-POC4"]
                            + ' ' + param_title[e["6-POC6"]].eng
                            + ' ' + e["9-POC9"]
                            + ' ' + e["10-POC10"]
                        + '</DRECONTENT>\n'
                            // BODY PART
                        + '<UCID>' + e["1-POC1"] + '</UCID>\n'
                        + '<IDPARAMTYPE>' + e["2-POC2"] + '</IDPARAMTYPE>\n'
                        + '<IDNUMBERTYPE>' + e["3-POC3"] + '</IDNUMBERTYPE>\n'
                        + '<IDCARD>' + e["4-POC4"] + '</IDCARD>\n'
                        + '<TITLETHAI>' + param_title[e["6-POC6"]].thai + '</TITLETHAI>\n'
                        + '<TITLEENG>' + param_title[e["6-POC6"]].eng + '</TITLEENG>\n'

                        + '<FIRSTNAMETHAI>' + e["7-POC7"] + '</FIRSTNAMETHAI>\n'
                        + '<LASTNAMETHAI>' + e["8-POC8"] + '</LASTNAMETHAI>\n'
                        + '<FIRSTNAMEENG>' + e["9-POC9"] + '</FIRSTNAMEENG>\n'
                        + '<LASTNAMEENG>' + e["10-POC10"] + '</LASTNAMEENG>\n'
                        + '<DATEOFBIRTH>' + e["11-POC11"] + '</DATEOFBIRTH>\n'
                        + '<DATEOFISSUE>' + e["12-POC12"] + '</DATEOFISSUE>\n'
                        + '<IDEXPIRYDATE>' + e["13-POC13"] + '</IDEXPIRYDATE>\n'
                        + '<COUNTRYTHAI>' + param_country[e["15-POC15"]].thai + '</COUNTRYTHAI>\n'
                        + '<COUNTRYENG>' + param_country[e["15-POC15"]].eng + '</COUNTRYENG>\n'
                        + '<NATIONALITYTHAI>' + param_country[e["17-POC17"]].thai + '</NATIONALITYTHAI>\n'
                        + '<NATIONALITYENG>' + param_country[e["17-POC17"]].eng + '</NATIONALITYENG>\n'
                        + '<GENDERTHAI>' + param_gender[e["19-POC19"]].thai + '</GENDERTHAI>\n'
                        + '<GENDERENG>' + param_gender[e["19-POC19"]].eng + '</GENDERENG>\n'
                        + '<HEIGHT>' + e["20-POC20"] + '</HEIGHT>\n'

                        + '</DOCUMENT>';

                }

                out = out + '</documents>';
                console.log(out);

                fs.writeFile('data-api-out.xml', out, function(err) {
                    if (err) throw err;
                    console.log('It\'s saved!');
                });
            }
        });
}

/**
 * Get Title
 *
 * @param callback
 */
function callingParam( param, return_callback ) {
    //console.log("Param Service ===");
    // call service
    var url = 'http://tisco-poc-data-api.au.cloudhub.io/query';

    var jsonParam = {
        'action_role': 'DEVELOPMENT',
        'dataset_name': '1-1-1_POC',
        'request_data': {
            '$': {
                'field': '1-POC61',
                'value': param,
                'function': 'eq'
            }
        }
    };

    //console.log('Request:\n' + JSON.stringify(jsonParam));

    unirest.post(url)
        .type('json')
        .send(jsonParam)
        .end(function (res) {
            var json = res.body;
            if(json.msg_code == 0) {
                // success
                //console.log('Success');
                var data = json.response_data;
                var param = {};
                for (var i = 0; i < data.length; i++) {
                    var e = data[i];
                    var str = {};
                    str['thai'] = e['3-POC63'];
                    str['eng'] = e['4-POC64'];
                    str['abb_thai'] = e['5-POC65'];
                    str['abb_eng'] = e['6-POC66'];
                    param[e['2-POC62']] = str;
                }
                return_callback(param);
            } else {
                console.log('Error:' + JSON.stringify(json));
            }

        });
}

// call
callingParam('1', function(result) {
    param_title = result;
    callingParam('2', function(result) {
        param_country = result;
        //console.log(JSON.stringify(param_country));
        callingParam('3', function(result) {
            param_gender = result;
            // call
            callingMain();
        });
    });
});


