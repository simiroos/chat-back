import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { getWeather } from './weather.mjs';
import { getJoke } from './jokes.mjs';

// server setup
const app = express();
app.use(bodyParser.json());
app.use(cors());

const logger = (req) => {
  const now = new Date();
  console.log(now, req.method, req.path, req.ip);
};

// Messages in memory
let messages = [];
const createMessage = (message) => {
  
  // guards
  if (!message) return messages;
  if (typeof message.username !== 'string' || message.username.length < 2) return messages;
  if (typeof message.body !== 'string' || message.body.length < 1) return messages;

  const newMessage = { username: message.username, body: message.body, id: uuidv4() };
  messages = [...messages.slice(-149), newMessage];
  return messages;
}

const sysCreateMessage = (body) => createMessage({ username: 'Chatbot', body })

// slash-commands
const executeSlash = async (message) => {
  if (typeof message !== 'string');
  const match = message.match(/\/(.+?)(\s(.+?))?$/)

  if (!match) return;

  const command = match[1];
  const context = match[3];

  switch(command) {
    case 'skämt':
      const joke = getJoke()
      sysCreateMessage(joke)
      break;
    case 'väder':
      const message = await getWeather();
      sysCreateMessage(message);
      break;
    default: 
      break;
  }
}

// handlers
app.get('/api/ping', (req, res) => {
  logger(req);
  res.pl('pong');
});

app.get('/api/messages', (req, res) => {
  logger(req);
  res.status(200).json(messages);
});

app.post('/api/messages', (req, res) => {
  logger(req);
  const newMessages = createMessage(req.body.message);
  executeSlash(req.body.message?.body);

  res.json(messages);
});

// server start
app.listen(4001);
console.log('Server started on http://localhost:127.0.0.1:4001');
