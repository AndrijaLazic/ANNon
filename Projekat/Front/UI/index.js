const express = require('express');
const app = express();

app.get('/', function(request, response){
    response.sendFile('/home/ANNon/igrANNonica/Front/dist/index.html');
});
app.listen(10000,'147.91.204.115')