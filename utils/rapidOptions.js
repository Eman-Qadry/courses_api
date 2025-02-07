 
function rapidapiOptions(reqUrl,id){
    return {
      method: 'GET',
      url: reqUrl,
      params: {
        id: id,
        key: process.env.x_rapidapi_key,
        part: 'snippet,contentDetails',
      },
      headers: {
        'x-rapidapi-host': process.env.x_rapidapi_host,
        'x-rapidapi-key': process.env.x_rapidapi_key,
      },
    };
  }
module.exports={rapidapiOptions}  