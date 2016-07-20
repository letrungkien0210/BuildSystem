var express = require('express');
var request = require('request');
var fs = require('fs');
var router = express.Router();

router.get("/", function (req, res) {

    fs.readFile("jenkins.txt", function (err, data) {
        if (err) {
            res.json(err);
        }

        var jenkinsJSON = JSON.parse(data);
        res.json(jenkinsJSON);
    });
});

//api for jenkins
router.route("/api/jenkins")
    .get(function (req, res) {

        fs.readFile("jenkins.txt", function (err, data) {
            if (err) {
                res.json(err);
            }

            var jenkinsJSON = JSON.parse(data);
            res.json(jenkinsJSON);
        });
    })
    .post(function (req, res) {
        var jenkinName = req.body.jenkinName;
        var jenkinUrl = req.body.jenkinUrl;
        var isExisted = false;

        var fileName = jenkinName.toLowerCase().replace(" ", "_");

        fs.readFile("jenkins.txt", function (err, data) {
            if (err) {
                res.json(err);
            }

            var jenkinsJSON = JSON.parse(data);


            for (var i = 0; i < jenkinsJSON.length; i++) {
                if (jenkinsJSON[i].name == jenkinName && jenkinsJSON[i].url == jenkinUrl) {
                    isExisted = true;
                }
            }

            if (isExisted) {
                res.send("Jenkin is exists");
                return;
            }


            jenkinsJSON.push({ name: jenkinName, url: jenkinUrl });

            var jenkinsString = JSON.stringify(jenkinsJSON);

            fs.writeFile("jenkins.txt", jenkinsString, function (err) {
                if (err) {
                    res.json(err);
                }
                res.json({ message: 'New Jenkins is updated.' });
            });
        });

        //Get job's data of Jenkins
        request(jenkinUrl + '/api/json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var dataJson = JSON.parse(body);
                var dataString = JSON.stringify(dataJson);
                
                fs.writeFile("jobs_" + fileName + ".txt",dataString, function (err, data) {
                    if (err) {
                        Console.log("Error: "+err);
                    }
                });
            }
        });

        //Get node's data of Jenkins
        request(jenkinUrl + '/computer/api/json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var dataJson = JSON.parse(body);
                var dataString = JSON.stringify(dataJson);
                
                fs.writeFile("computers_" + fileName + ".txt",dataString, function (err, data) {
                    if (err) {
                        Console.log("Error: "+err);
                    }
                });
            }
        });
        
    })
    .delete(function (req, res) {
        var jenkinsString = JSON.stringify(req.body);
        fs.writeFile("jenkins.txt", jenkinsString, function (err) {
            if (err) {
                res.json(err);
            }
            res.json({ message: 'Update Jenkins\' data successful' });
        })
        
        // var fileName = jenkinName.toLowerCase().replace(" ", "_");
        
        // //Delete jobs' data of Jenkins
        // js.unlink();
        // //Delete computers' data of Jenkins
        // js.unlink();
    });
//api to check status of Jenkins' URL
router.post('/api/check_status', function (req, res) {

    request(req.body.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json({ message: 'Active' });
            return;
        }
        res.json({ message: 'Disactive' });
    })
});

//api for jobs
router.post('/api/jobs', function (req, res) {
    var jenkinName = req.body.jenkinName.toString();
    var fileName = jenkinName.toLowerCase().replace(" ", "_");
    
    fs.readFile("jobs_" + fileName + ".txt", function (err, data) {
        if (err) {
            res.json(err);
        }

        var data = JSON.parse(data);

        res.json(data.jobs);
    });
});
// router.get("/api/updateStatusJobs", function (req, res) {
//     request('http://iwftbld0100.ind.hp.com:8080/api/json', function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             var dataJson = JSON.parse(body);
//             var dataString = JSON.stringify(dataJson);

//             fs.writeFile("jobs.txt", dataString, function (err, data) {
//                 if (err) {
//                     res.send("Error: " + err);
//                 }
//                 res.json({ message: "Updated Jobs' status" });
//             })
//         } else {
//             res.json(error);
//         }
//     });
// });
router.post('/api/jobs/computer', function(req, res){
    var linkJob = req.body.url + '/api/json?depth=3';
    request(linkJob, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var jsonData = JSON.parse(body);
            // //Get infomations at last build.
            // res.json(jsonData.lastBuild);
            var returnData = {};
            if(jsonData.lastBuild){
                if(jsonData.lastBuild.builtOn){
                    returnData.buildOn = jsonData.lastBuild.builtOn;
                }else{
                    returnData.buildOn = 'master';
                }            
                returnData.fingerprint = jsonData.lastBuild.fingerprint;
                res.json(returnData);
            }else{
                returnData.buildOn      = '';
                returnData.fingerprint  = '';
            }
            return;
        }
        res.json({ error: error });
    });
});

//api for node
router.post('/api/computers', function (req, res) {
    var jenkinName = req.body.jenkinName.toString();
    var fileName = jenkinName.toLowerCase().replace(" ", "_");
    
    fs.readFile("computers_" + fileName + ".txt", function (err, data) {
        if (err) {
            res.json(err);
        }

        var data = JSON.parse(data);

        res.json(data.computer);
    });
});
router.get('/api/updateStatusNode', function (req, res) {
    request('http://iwftbld0100.ind.hp.com:8080/computer/api/json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataJson = JSON.parse(body);
            var dataString = JSON.stringify(dataJson);

            fs.writeFile("nodes.txt", dataString, function (err, data) {
                if (err) {
                    res.send("Error: " + err);
                }
                res.json({ message: "Updated Nodes' status" });
            })
        } else {
            res.json(error);
        }
    });
});

//update data of jobs and jenkins
router.get('/api/updateAll', function (req, res) {
    //How to process one by one? (fixing)
    request('http://iwftbld0100.ind.hp.com:8080/api/json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataJson = JSON.parse(body);
            var dataString = JSON.stringify(dataJson);

            fs.writeFile("jobs.txt", dataString, function (err, data) {
                if (err) {
                    res.send("Error: " + err);
                }
                res.json({ message: "Updated Jobs' status" });
            })
        } else {
            res.json(error);
        }
    });

    request('http://iwftbld0100.ind.hp.com:8080/computer/api/json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataJson = JSON.parse(body);
            var dataString = JSON.stringify(dataJson);

            fs.writeFile("nodes.txt", dataString, function (err, data) {
                if (err) {
                    res.send("Error: " + err);
                }
                res.json({ message: "Updated Nodes' status" });
            })
        } else {
            res.json(error);
        }
    });
});
module.exports = router;