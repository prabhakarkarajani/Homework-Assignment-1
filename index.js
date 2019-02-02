/* 
*primary files for the API
*
*/
//import required libraries
const http = require('http');
const https = require('https');
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config')
const fs = require('fs');

//Http server fn
const httpServer = http.createServer((req, res) => {
    unifiedServer(req,res);
})
const httpsServerOptions = {   
    'key': fs.readFileSync('./https/key.pem'),
    'cert':  fs.readFileSync('./https/cert.pem')
  };
//Https server fn
const httpsServer = https.createServer(httpsServerOptions,(req,res) =>{
    unifiedServer(req,res);
})

//Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort, () =>  console.log(`this server lisiting port ${config.httpPort} now`) );

 // need key and cert 

httpsServer.listen(config.httpsPort,()=> console.log(`this secure server listing port ${config.httpsPort} now`))

//All the server logic for http and https service
const unifiedServer =(req,res) =>{
/*parsed url ==> user requesting url access here
    *   req.url ==> passing user requested url linke localhost:4000/users
    */
   const parsedUrl = url.parse(req.url, true)
   //get the parsed url pathname 
   const pathname = parsedUrl.pathname;
   //trim the pathname => remove the unwanted /
   const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');
   console.log(trimmedPath)

   //parsing query string
   const queryStringObj = parsedUrl.query;

   //http methods we have GET, PUT, POST, DELETE
   //check the what type of method it is
   //parsing HTTP method
   const method = req.method.toLowerCase()

   //header 
   const headers = req.headers;
   const decoder = new StringDecoder('utf-8');
   let buffer = "";
   req.on('data', data => {
       buffer += decoder.write(data)
   })

   req.on('end', () => {
       buffer += decoder.end();

       //choose handler request go to
       // CHoose the hanlder this request should go to.
       // if one is not found , use the notFound handler
       let handler;
       if (typeof (router[trimmedPath]) !== 'undefined') {
           handler = router[trimmedPath];
       } else {
           handler = handlers.notFound;
       }
       const chooseHandler = handler;
       let data = {
           "trimmedPath": trimmedPath,
           "queryStringObj": queryStringObj,
           "headers": headers,
           "method": method,
           "payload": buffer
       };

       //Route the request to the handler specified in the router
       chooseHandler(data,  (statusCode, payload) =>{
           // Use the status code called back by the handler
           // pr default to 200
           statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

           //use the payload called back by the handler, or default to 
           // an empty object
           payload = typeof (payload) === 'object' ? payload : {};

           // Conert the payload to a string
           const payloadString = JSON.stringify(payload);

           //Return the response
           res.setHeader('Content-Type', 'application/json');
           res.writeHead(statusCode);
           res.end(payloadString);

           // log
           console.log('Request this response : ', statusCode, payloadString);
       });



   })
}
// Define the handlers
const handlers = {};

// Sample handler
handlers.hello = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(200,{"name":"Hello World"});
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
}

// Define a request rouer
const router = {
    'hello': handlers.hello
};