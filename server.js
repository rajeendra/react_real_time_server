// HTTP Server:
const express = require("express");
const os = require("os");
const app = express();

// This will serve the static files in the /public folder on our server
app.use(express.static("public"));

const server = app.listen(process.env.PORT, function () {
//const server = app.listen(8080, function () {
  console.log("app address is " + os.hostname());
  console.log("app is listening on port " + server.address().port);
});

// Websocket Server:
// We are using the external library 'ws' to set up the websockets on the server
// https://www.npmjs.com/package/ws
// In our code this is stored in the variable WebSocket.
var WebSocket = require("ws");

// Connect our Websocket server to our server variable to serve requests on the same port:
var wsServer = new WebSocket.Server({ server });

// This function will send a message to all clients connected to the websocket:
function broadcastToAll(data) {
    const dataJsonString = data.toString();
    const dataJson = JSON.parse(dataJsonString);
     
    console.log(wsServer.clients.size)  
   
    wsServer.clients.forEach((client) => {
      //console.log(JSON.stringify(client))  
    });

    let sent = false;
    wsServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && !sent ) {

            if (dataJson.client == "WA2934789283") {
              client.send(data);
              console.log("Message sent..");
            } 
        }
    });
}

// This outer function will run each time the Websocket
// server connects to a new client:
wsServer.on("connection", (ws) => {
    // We will store the id for this connection in the id property.
    ws.id = "";

    //This function will run every time the server recieves a message with that client.
      ws.on("message", (data) => {
        //Broadcast the received message back to all clients.

        console.log("Message Received:", ws.id);
        // console.log(data.toString())

        // broadcast to all the client the server has been connected
        // broadcastToAll(data.toString());

        // broadcast only to the client which the message has been received
        ws.send(data.toString());
      });

      ws.on("close", () => {
        console.log("Disconnected:", ws.id);
        // Here you could send a message to other clients that
        // this client has disconnected.
      });
});
