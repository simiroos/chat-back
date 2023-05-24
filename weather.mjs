import fetch from 'node-fetch';

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

export const getWeather = async () => {
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