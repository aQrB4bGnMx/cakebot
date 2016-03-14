var stream = {"stream": "sinqnew", "channel": 125322705837883392};

require('http').request({
    host: 'example.com',
    path: '/path/to/get',
    method: 'GET'
}, function(res){
    res.setEncoding('utf8');
    var body = '';
    res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        body = JSON.parse(body);
        console.log(body);
    });
}).end();
