
// jokes
const jokes = [
  'Vad kallas en person utan slöja? Avslöjad!',
  'Vad kallar man fötter utan något ärr? fötte',
  'Folk fråga Magic-mike varför är du så tjock, då svara magic-mike-jag är inte tjock utan jag är en bodybuilder', 
  'Det viktigaste när du köper fotbollsskor är att de passar bra.',
  'du',
  'vad heter en spansk bil, El bil',
]

export const getJoke = () => {
  return jokes[Math.floor(Math.random()*jokes.length)];
}