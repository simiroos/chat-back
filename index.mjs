import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

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

const sysCreateMessage = (body) => createMessage({ username: 'chatbot', body })

// jokes
const jokes = [
  'Vad kallas en person utan slöja? Avslöjad!',
  'Vad kallar man fötter utan något ärr? fötte',
  'Folk fråga Magic-mike varför är du så tjock, då svara magic-mike-jag är inte tjock utan jag är en bodybuilder', 
  'Det viktigaste när du köper fotbollsskor är att de passar bra.',
  'du',
  'vad heter en spansk bil, El bil',
]


const conditionFromCode = (code) => {
  const match = code.match(/(.+?)_(.+?)/)
  if (!match) return 'Ingen aning';

  switch(match[1]) {
    case 'clearsky':
      if (match[1] === 'day') return 'solig' 
      return 'är klarhimmel'
    case 'cloudy':
      return 'är ganska molnigt'
    case 'fair':
      return 'är lite molningt'
    case 'fog':
      return 'är dimmigt'
    case 'heavyrain':
      return 'spöregnar'
    case 'heavyrainandthunder':
      return 'åskar'
    case 'heavyrainshowers':
      return 'regnar'
    case 'heavyrainshowersandthunder':
      return 'åskar'
    case 'heavysleet':
      return 'blötsnöar'
    case 'heavysleetandthunder':
      return 'blötsnöar och åskar'
    case 'heavysleetshowers':
      return 'blötsnöar'
    case 'heavysleetshowersandthunder':
      return 'blötsnöar och åskar'
    case 'heavysnow':
      return 'är snöstorm'
    case 'heavysnowandthunder':
      return 'är snöstorm och det åskar'
    case 'heavysnowshowers':
      return 'är snöstorm'
    case 'heavysnowshowersandthunder':
      return 'är snöstorm och det åskar'
    case 'lightrain':
      return 'duggregnar'
    case 'lightrainandthunder':
      return 'dugregnar och åskar'
    case 'lightrainshowers':
      return 'duggregnar'
    case 'lightrainshowersandthunder':
      return 'duggregnar och åskar'
    case 'lightsleet':
      return 'blötsnöar lite'
    case 'lightsleetandthunder':
      return 'blötsnöar lite och åskar'
    case 'lightsleetshowers':
      return 'blötsnöar lite'
    case 'lightsnow':
      return 'lättsnöar'
    case 'lightsnowandthunder':
      return 'lättsnöar och åskar'
    case 'lightsnowshowers':
      return 'lättsnöar'
    case 'lightssleetshowersandthunder':
      return 'lättsnöar och åskar'
    case 'lightssnowshowersandthunder':
      return 'det lättsnöar och åskar'
    case 'partlycloudy':
      return 'är delvis molnigt'
    case 'rain':
      return 'rägnar'
    case 'rainandthunder':
      return 'rägnar och åskar'
    case 'rainshowers':
      return 'regnar'
    case 'rainshowersandthunder':
      return 'regnar och åskar'
    case 'sleet':
      return 'blötsnöar'
    case 'sleetandthunder':
      return 'blötsnöar och åskar'
    case 'sleetshowers':
      return 'blötsnöar och regnar'
    case 'sleetshowersandthunder':
      return 'blötsnöar, regnar och åskar'
    case 'snow':
      return 'snöar'
    case 'snowandthunder':
      return 'snöar och åskar'
    case 'snowshowers':
      return 'snöar och regnar'
    case 'snowshowersandthunder':
      return 'snöar, regnar och åskar'
    default:
      return 'Ingen aning'
  }
};

const getWeather = async () => {
  try {
    const result = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.4214&lon=16.5911&altitude=50', { headers: {'user-agent': 'simeons-app' } });
    const weatherResult = await result.json()

    const temp = weatherResult.properties.timeseries[0].data.instant.details.air_temperature;
    const condition = conditionFromCode(weatherResult.properties.timeseries[0].data.next_1_hours.summary.symbol_code)

    return `Temperaturen är ${temp}°C och det ${condition}`

  } catch (error) {
    console.log(error);
    return 'Något gick fel :('
  }
}

// slash-commands
const executeSlash = async (message) => {
  if (typeof message !== 'string');
  const match = message.match(/\/(.+?)(\s(.+?))?$/)

  if (!match) return;

  const command = match[1];
  const context = match[3];

  switch(command) {
    case 'joke':
    const joke = jokes [Math.floor(Math.random()*jokes.length)];
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
