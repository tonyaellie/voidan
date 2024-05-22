import { useState } from 'react';

const unparsed = `zalu - run
vola - come
muka - eat
doru - sleep
wesa - speak
liku - read
pira - write
buna - drink
yuna - have
bulu - imagine
iru - need
vida - see
oku - hear
unta - understand
kika - walk
toka - talk
listu - listen
penu - think
senu - feel
smila - smile
laba - laugh
kria - cry
plei - play
woka - work
studa - study
dansa - dance
sina - sing
kuka - cook
klina - clean
travi - travel
resa - rest
kreb - create
eksplorq - explore
lernix - learn
tecoq - teach
kopix - buy
vendeq - sell
fikst - fix
kambust - change
aidu - help
dunez - give
takaq - take
gisl - forget
memoraq - remember
krediq - believe
dramiq - dream
hox - hope
luveb - love
heth - hate
firaq - fear
finist - finish
stort - start
stopt - stop
grovix - grow
shrinkat - shrink
waitu - wait
tura - cat
bela - house
lina - water
falu - moon
noko - friend
veska - secret
kifa - book
mokra - car
zara - tree
kunu - dog
mesa - city
pako - food
sola - sun
reva - party
uma - day
nala - night
fika - cake
telo - phone
kompo - computer
tempera - temperature
kovo - bird
pifi - fish
muno - rabbit
elefa - elephant
levo - lion
tigra - tiger
beraq - bear
vulo - wolf
dera - deer
folx - fox
korsa - horse
moka - cow
shaap - sheep
goxa - goat
pigaq - pig
sana - beautiful
neba - sad
jola - happy
anegra - angry
eksita - excited
kenda - kind
kleva - clever
wisa - wise
stonga - strong
wika - weak
fasta - fast
slola - slow
jenera - generous
luya - loyal
pasha - patient
kalma - calm
tira - tired
hura - hungry
sula - thirsty (new word)
glia - ugly
brava - brave
mi - me
mi - i
esi - you
wi - we
dei - they
hi - he
shi - she
ka - yes
ne - no
pla - please
dani - thank you
sen - is
en - and
ma - but
o - or
kaso - because
hovra - however
donc - therefore
mentris - meanwhile
plu - moreover
olto - although
nive - nevertheless
furda - furthermore
glidand - good`;

const englishToVoidan = new Map<string, string>();
const voidanToEnglish = new Map<string, string>();
unparsed.split('\n').forEach((line) => {
  const [voidan, english] = line.split(' - ');
  englishToVoidan.set(english, voidan);
  voidanToEnglish.set(voidan, english);
});

const translate = (
  toTranslate: string,
  direction: 'toVoidan' | 'toEnglish'
) => {
  const chars = toTranslate.split('');
  const result: (JSX.Element | string)[] = [];
  let currPos = 0;
  while (currPos < chars.length) {
    if (/[^a-zA-Z]/.test(chars[currPos])) {
      result.push(chars[currPos]);
      currPos++;
      continue;
    }
    if (chars[currPos + 1] && /[a-zA-Z]/.test(chars[currPos + 1])) {
      chars[currPos] += chars[currPos + 1];
      chars.splice(currPos + 1, 1);
    } else {
      switch (direction) {
        case 'toVoidan':
          {
            const voidan = englishToVoidan.get(chars[currPos].toLowerCase());
            if (voidan) {
              result.push(
                <span>
                  {/[a-z]/.test(chars[currPos])
                    ? /[a-z]/.test(chars[currPos][0])
                      ? voidan
                      : `${voidan[0].toLocaleUpperCase()}${voidan.slice(1)}`
                    : voidan.toLocaleUpperCase()}
                </span>
              );
            } else {
              result.push(<span className="italic">{chars[currPos]}</span>);
            }
          }
          break;
        case 'toEnglish': {
          const english = voidanToEnglish.get(chars[currPos].toLowerCase());
          if (english) {
            result.push(
              <span>
                {/[a-z]/.test(chars[currPos])
                  ? /[a-z]/.test(chars[currPos][0])
                    ? english
                    : `${english[0].toLocaleUpperCase()}${english.slice(1)}`
                  : english.toLocaleUpperCase()}
              </span>
            );
          } else {
            result.push(<span className="italic">{chars[currPos]}</span>);
          }
        }
      }

      currPos++;
    }
  }
  return result;
};

function App() {
  const [sentence, setSentence] = useState('');
  const [direction, setDirection] = useState<'toVoidan' | 'toEnglish'>(
    'toVoidan'
  );

  return (
    <div className="w-full flex pt-20 justify-center">
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-2">
          <div className="select-none">
            {direction === 'toVoidan' ? 'English' : 'Voidan'}
          </div>
          <textarea
            className="resize-none w-96 h-32 border-2 p-2 border-gray-300 rounded-md"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
          />
        </div>
        <svg
          onClick={() => {
            setDirection((direction) =>
              direction === 'toVoidan' ? 'toEnglish' : 'toVoidan'
            );
            setSentence(
              translate(sentence, direction)
                .map((word) =>
                  typeof word === 'string' ? word : word.props.children
                )
                .join('')
            );
          }}
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m16 3 4 4-4 4" />
          <path d="M20 7H4" />
          <path d="m8 21-4-4 4-4" />
          <path d="M4 17h16" />
        </svg>
        <div className="flex flex-col items-center gap-2">
          <div className="select-none">
            {direction === 'toVoidan' ? 'Voidan' : 'English'}
          </div>
          <div className="w-96 h-32 border-2 p-2 border-gray-300 rounded-md bg-gray-100">
            {translate(sentence, direction)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
