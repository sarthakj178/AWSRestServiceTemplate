var response = {
    headers: {
        'Content-Type': 'application/json',
        'AllowHeaders': 'Origin,X-Requested-With,Content-Type,content-type,Accept',
        'Access-Control-Allow-Origin': '*',
    }
};

exports.ping = function (event, context, callback) {
    response.statusCode = 200;
    response.body = JSON.stringify({success: true, message: "Hello world"});
    callback(null, response);
}