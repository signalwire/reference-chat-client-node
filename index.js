const express = require('express');
require('dotenv').config()

const PORT = process.env.PORT || 5001
const app = express();
const http = require('http').createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'))
var cors = require('cors')
app.use(cors());
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// async function apiRequest(endpoint, payload = {}, method = 'POST') {
//   var url = `https://${process.env.SIGNALWIRE_SPACE}${endpoint}`

//   var request = {
//     method: method, // *GET, POST, PUT, DELETE, etc.
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     headers: {
//       'Content-Type': 'application/json',
//       "Authorization": `Basic ${base64.encode(`${process.env.SIGNALWIRE_PROJECT_KEY}:${process.env.SIGNALWIRE_TOKEN}`)}`
//     }
//   }

//   if (method != 'GET') {
//     request.body = JSON.stringify(payload)
//   }
//   const response = await fetch(url, request);
//   return await response.json();
// }

async function getToken(uuid, info = {}) {
  const res = await axios.post(`${process.env.CHAT_INSTANCE}/create_token`, 
  {
    uuid,
    info,
    "space": process.env.SIGNALWIRE_SPACE,
  },
  {
    auth: {
      username: process.env.SIGNALWIRE_PROJECT_KEY,
      password: process.env.SIGNALWIRE_TOKEN
    }
  });
  return res.data;
}

app.get('/', async (req, res) => {
  var uuid = req.query.uuid || uuidv4().split('-')[0];
  var token = await getToken(uuid, {});
  console.log(token)
  res.render('index', { token: token.token, instance: process.env.CHAT_INSTANCE, uuid: uuid });
});

http.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening to ${PORT}`);
});