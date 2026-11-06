// Offline story and picture maker. Every book stars Tiko; the words and pictures are built on the phone.
window.TikoBooks = (function () {
  const FRIENDS = {
    bantay: { kind: 'carabao', name: 'Bantay', en: 'a carabao', fil: 'kalabaw', tl: 'kalabaw' },
    pipay: { kind: 'bird', name: 'Pipay', en: 'a little maya bird', fil: 'ibong maya', tl: 'maya bird' },
    bibo: { kind: 'turtle', name: 'Bibo', en: 'a turtle', fil: 'pagong', tl: 'pagong' },
    ningning: { kind: 'firefly', name: 'Ningning', en: 'a firefly', fil: 'alitaptap', tl: 'alitaptap' },
    mingming: { kind: 'cat', name: 'Mingming', en: 'a cat', fil: 'pusa', tl: 'pusa' },
  };
  const LESSONS = {
    brave: {
      label: 'Being brave',
      en: ['"I am scared," said Tiko. "That is okay," said {f}. "Brave friends can be scared too."', 'Tiko learned that being brave means trying, even when you feel small.'],
      fil: ['"Natatakot ako," sabi ni Tiko. "Ayos lang," sabi ni {f}. "Natatakot din ang matatapang."', 'Natutunan ni Tiko na ang matapang ay sumusubok, kahit maliit ang pakiramdam niya.'],
      tl: ['"Scared ako," sabi ni Tiko. "Okay lang yan," sabi ni {f}. "Kahit brave, natatakot din."', 'Natutunan ni Tiko na ang pagiging brave ay ang pagsubok, kahit maliit ang feeling mo.'],
    },
    kind: {
      label: 'Being kind',
      en: ['"Do not cry," said {f}, and gave Tiko a gentle hug.', 'Tiko learned that one kind friend can make a hard day feel light.'],
      fil: ['"Huwag kang umiyak," sabi ni {f}, at niyakap si Tiko.', 'Natutunan ni Tiko na gumagaan ang mahirap na araw kapag may mabait na kaibigan.'],
      tl: ['"Don\'t cry, Tiko," sabi ni {f}, sabay hug nang mahigpit.', 'Natutunan ni Tiko na gumagaan ang hard day kapag may kind na friend.'],
    },
    share: {
      label: 'Sharing',
      en: ['"Let us do this together," said {f}. "I will share my time with you."', 'Tiko learned that everything is more fun when you share it.'],
      fil: ['"Sabay nating gawin," sabi ni {f}. "Ibabahagi ko ang oras ko sa iyo."', 'Natutunan ni Tiko na mas masaya ang lahat kapag ibinabahagi.'],
      tl: ['"Sabay tayo," sabi ni {f}. "I-share ko ang time ko sa iyo."', 'Natutunan ni Tiko na mas fun ang lahat kapag nagse-share.'],
    },
    tryagain: {
      label: 'Trying again',
      en: ['"I cannot do it," said Tiko. "Not yet," said {f}. "Let us try once more."', 'Tiko learned that "not yet" is not the same as "never".'],
      fil: ['"Hindi ko kaya," sabi ni Tiko. "Hindi pa lang," sabi ni {f}. "Subukan natin ulit."', 'Natutunan ni Tiko na iba ang "hindi pa" sa "hindi kailanman".'],
      tl: ['"Hindi ko kaya," sabi ni Tiko. "Not yet lang," sabi ni {f}. "Try ulit tayo."', 'Natutunan ni Tiko na iba ang "not yet" sa "never".'],
    },
    patient: {
      label: 'Being patient',
      en: ['"I want it now!" said Tiko. "Slowly," said {f}. "Breathe, and we will find a way."', 'Tiko learned that good things come to those who wait and keep going.'],
      fil: ['"Gusto ko na ngayon!" sabi ni Tiko. "Dahan-dahan," sabi ni {f}. "Huminga ka muna."', 'Natutunan ni Tiko na dumarating ang magagandang bagay sa marunong maghintay.'],
      tl: ['"Gusto ko na now!" sabi ni Tiko. "Dahan-dahan," sabi ni {f}. "Breathe muna."', 'Natutunan ni Tiko na dumarating ang good things sa marunong maghintay.'],
    },
    thanks: {
      label: 'Saying thank you',
      en: ['"Will you help me?" asked Tiko. "Of course," said {f}. "That is what friends do."', 'Tiko learned that a small "thank you" can make a friend smile all day.'],
      fil: ['"Tutulungan mo ba ako?" tanong ni Tiko. "Oo naman," sabi ni {f}. "Magkaibigan tayo."', 'Natutunan ni Tiko na nakakapagpasaya ang simpleng "salamat".'],
      tl: ['"Help mo ba ako?" tanong ni Tiko. "Of course," sabi ni {f}. "Friends tayo, eh."', 'Natutunan ni Tiko na nakakapagpasaya ng friend ang simpleng "thank you".'],
    },
  };
  const THEMES = {
    kite: {
      label: 'Paper kite', scene: 'hill', prop: 'kite', lostAt: 'tree', cover: 1,
      en: { title: 'Tiko and the Paper Kite', place: 'a windy green hill', want: 'fly a red paper kite', goal: 'Up went the kite, higher and higher!', ps: 'Oh no! The kite is stuck!', p: 'Whoosh! The wind pulled the kite into a tall mango tree.', idea: 'Maybe we can reach it from the big branch,', fs: 'The kite came down!', f: 'Step by step, they climbed, and the kite floated down.', joy: 'The kite danced in the sky again.' },
      fil: { title: 'Si Tiko at ang Saranggola', place: 'isang mahanging burol', want: 'magpalipad ng pulang saranggola', goal: 'Lumipad ang saranggola, pataas nang pataas!', ps: 'Naku! Sumabit ang saranggola!', p: 'Hooosh! Hinila ng hangin ang saranggola papunta sa mataas na puno ng mangga.', idea: 'Baka maabot natin mula sa malaking sanga,', fs: 'Bumaba ang saranggola!', f: 'Dahan-dahan silang umakyat, at bumaba rin ang saranggola.', joy: 'Muling sumayaw ang saranggola sa langit.' },
      tl: { title: 'Si Tiko at ang Paper Kite', place: 'isang windy na burol', want: 'magpalipad ng red na kite', goal: 'Lumipad ang kite, higher and higher!', ps: 'Oh no! Stuck ang kite!', p: 'Whoosh! Hinila ng wind ang kite papunta sa mataas na mango tree.', idea: 'Baka ma-reach natin from the big branch,', fs: 'Bumaba ang kite!', f: 'Step by step silang umakyat, tapos bumaba rin ang kite.', joy: 'Sumayaw ulit ang kite sa sky.' },
    },
    rain: {
      label: 'Rainy day', scene: 'rain', prop: 'umbrella', lostAt: 'bush', cover: 3,
      en: { title: 'Tiko and the Runaway Umbrella', place: 'a rainy green forest', want: 'walk in the rain with a yellow umbrella', goal: 'Plip, plop, plip, plop went the rain!', ps: 'Oh no! The umbrella flew away!', p: 'Swoosh! A big gust took the umbrella into a thorny bush.', idea: 'Maybe we can pull it out slowly,', fs: 'The umbrella came back!', f: 'They pulled gently, and out came the umbrella.', joy: 'They splashed home together under one umbrella.' },
      fil: { title: 'Si Tiko at ang Payong na Tumakas', place: 'isang maulang gubat', want: 'maglakad sa ulan dala ang dilaw na payong', goal: 'Plip, plop, plip, plop ang patak ng ulan!', ps: 'Naku! Lumipad ang payong!', p: 'Swoosh! Tinangay ng malakas na hangin ang payong papunta sa matinik na halaman.', idea: 'Baka mahila natin nang dahan-dahan,', fs: 'Nakuha ang payong!', f: 'Dahan-dahan nilang hinila, at lumabas ang payong.', joy: 'Sabay silang umuwi sa ilalim ng iisang payong.' },
      tl: { title: 'Si Tiko at ang Runaway Payong', place: 'isang rainy na gubat', want: 'maglakad sa ulan with a yellow payong', goal: 'Plip, plop, plip, plop ang rain!', ps: 'Oh no! Lumipad ang payong!', p: 'Swoosh! Tinangay ng hangin ang payong papunta sa matinik na bush.', idea: 'Baka mahila natin nang slowly,', fs: 'Nakuha ang payong!', f: 'Dahan-dahan nilang hinila, tapos lumabas ang payong.', joy: 'Sabay silang umuwi under one payong.' },
    },
    sea: {
      label: 'By the sea', scene: 'sea', prop: 'boat', lostAt: 'water', cover: 0,
      en: { title: 'Tiko and the Little Bangka', place: 'a sunny white beach', want: 'sail a little wooden bangka', goal: 'Splish, splash went the waves on the sand!', ps: 'Oh no! The bangka is floating away!', p: 'Slowly, a wave carried the little bangka far from the shore.', idea: 'Maybe the waves will help us bring it back,', fs: 'The bangka came home!', f: 'They waited for the big wave, and it pushed the bangka back.', joy: 'The little bangka rocked happily on the sand.' },
      fil: { title: 'Si Tiko at ang Munting Bangka', place: 'isang maaraw na dalampasigan', want: 'magpalutang ng munting bangka', goal: 'Splish, splash ang mga alon sa buhangin!', ps: 'Naku! Lumalayo ang bangka!', p: 'Dahan-dahan, tinangay ng alon ang munting bangka palayo sa pampang.', idea: 'Baka tulungan tayo ng mga alon,', fs: 'Bumalik ang bangka!', f: 'Hinintay nila ang malaking alon, at itinulak nito pabalik ang bangka.', joy: 'Masayang umuugoy ang munting bangka sa buhangin.' },
      tl: { title: 'Si Tiko at ang Little Bangka', place: 'isang sunny na beach', want: 'magpalutang ng little bangka', goal: 'Splish, splash ang waves sa sand!', ps: 'Oh no! Lumalayo ang bangka!', p: 'Slowly, tinangay ng wave ang little bangka palayo sa shore.', idea: 'Baka tulungan tayo ng waves,', fs: 'Bumalik ang bangka!', f: 'Hinintay nila ang big wave, tapos itinulak nito pabalik ang bangka.', joy: 'Happy na umuugoy ang little bangka sa sand.' },
    },
    parol: {
      label: 'Christmas parol', scene: 'night', prop: 'parol', lostAt: 'roof', cover: 4,
      en: { title: 'Tiko and the Brightest Parol', place: 'a quiet barrio at night', want: 'hang a shining star parol', goal: 'The whole barrio glowed with little lights!', ps: 'Oh no! The parol fell!', p: 'Thump! The wind blew the parol onto a high roof, and its light went out.', idea: 'Maybe a small light can wake it up,', fs: 'The parol is shining!', f: 'They reached the roof together, and the parol glowed again.', joy: 'It was the brightest star in the barrio.' },
      fil: { title: 'Si Tiko at ang Pinakamaningning na Parol', place: 'isang tahimik na baryo sa gabi', want: 'magsabit ng makinang na parol', goal: 'Kumikislap ang buong baryo sa munting ilaw!', ps: 'Naku! Nahulog ang parol!', p: 'Blag! Tinangay ng hangin ang parol sa mataas na bubong, at namatay ang ilaw nito.', idea: 'Baka magising ito ng munting ilaw,', fs: 'Nagliwanag ang parol!', f: 'Sabay nilang inabot ang bubong, at muling nagliwanag ang parol.', joy: 'Ito ang pinakamaningning na bituin sa baryo.' },
      tl: { title: 'Si Tiko at ang Brightest Parol', place: 'isang quiet na baryo sa gabi', want: 'magsabit ng shining na parol', goal: 'Kumikislap ang buong baryo sa little lights!', ps: 'Oh no! Nahulog ang parol!', p: 'Blag! Tinangay ng wind ang parol sa mataas na roof, at namatay ang ilaw.', idea: 'Baka magising ito ng small light,', fs: 'Nag-shine ang parol!', f: 'Sabay nilang inabot ang roof, tapos nag-shine ulit ang parol.', joy: 'Ito ang brightest star sa baryo.' },
    },
    market: {
      label: 'At the palengke', scene: 'market', prop: 'basket', lostAt: 'stall', cover: 5,
      en: { title: 'Tiko at the Busy Palengke', place: 'a busy morning palengke', want: 'bring home a basket of sweet mangoes', goal: 'Everyone was calling, "Fresh fruit! Fresh fruit!"', ps: 'Oh no! The basket is gone!', p: 'Bump! Someone rushed past, and the basket rolled under a fruit stall.', idea: 'Maybe the kind fruit seller saw it,', fs: 'The basket was found!', f: 'They asked politely, and the fruit seller smiled and found the basket.', joy: 'They shared sweet mangoes all the way home.' },
      fil: { title: 'Si Tiko sa Maingay na Palengke', place: 'isang maingay na palengke', want: 'mag-uwi ng basket ng matamis na mangga', goal: 'Sigaw ng lahat, "Bili na! Bili na!"', ps: 'Naku! Nawala ang basket!', p: 'Blag! May nagmamadaling dumaan, at gumulong ang basket sa ilalim ng tindahan.', idea: 'Baka nakita ng mabait na tindera,', fs: 'Nakita ang basket!', f: 'Magalang silang nagtanong, at ngumiti ang tindera habang inaabot ang basket.', joy: 'Pinagsaluhan nila ang matamis na mangga pauwi.' },
      tl: { title: 'Si Tiko sa Busy na Palengke', place: 'isang busy na palengke', want: 'mag-uwi ng basket ng sweet na mangga', goal: 'Sigaw ng lahat, "Fresh fruits! Bili na!"', ps: 'Oh no! Nawala ang basket!', p: 'Blag! May nagmamadaling dumaan, tapos gumulong ang basket sa ilalim ng stall.', idea: 'Baka nakita ng kind na tindera,', fs: 'Nakita ang basket!', f: 'Polite silang nagtanong, at ngumiti ang tindera habang inaabot ang basket.', joy: 'Nag-share sila ng sweet na mangga pauwi.' },
    },
    farm: {
      label: 'Rice field', scene: 'farm', prop: 'hat', lostAt: 'field', cover: 3,
      en: { title: 'Tiko and the Flying Salakot', place: 'a wide golden rice field', want: 'help at the farm in a big salakot hat', goal: 'The rice swayed left and right in the breeze!', ps: 'Oh no! The hat flew off!', p: 'Fwoop! The breeze lifted the salakot and dropped it far into the rice.', idea: 'Maybe we can follow the path by the water,', fs: 'The hat is back!', f: 'They walked along the narrow path and reached the salakot.', joy: 'Tiko wore the big hat all the way to the nipa hut.' },
      fil: { title: 'Si Tiko at ang Lumilipad na Salakot', place: 'isang malawak na palayan', want: 'tumulong sa bukid suot ang malaking salakot', goal: 'Sumasayaw ang palay sa simoy ng hangin!', ps: 'Naku! Lumipad ang salakot!', p: 'Fwoop! Inangat ng hangin ang salakot at bumagsak sa gitna ng palayan.', idea: 'Baka masundan natin ang pilapil,', fs: 'Bumalik ang salakot!', f: 'Naglakad sila sa makitid na pilapil at naabot ang salakot.', joy: 'Suot ni Tiko ang malaking salakot hanggang sa bahay kubo.' },
      tl: { title: 'Si Tiko at ang Flying Salakot', place: 'isang malawak na rice field', want: 'tumulong sa farm suot ang big na salakot', goal: 'Sumasayaw ang palay sa breeze!', ps: 'Oh no! Lumipad ang salakot!', p: 'Fwoop! Inangat ng breeze ang salakot at bumagsak sa gitna ng palayan.', idea: 'Baka masundan natin ang pilapil,', fs: 'Bumalik ang salakot!', f: 'Naglakad sila sa narrow na pilapil at naabot ang salakot.', joy: 'Suot ni Tiko ang big na salakot hanggang sa bahay kubo.' },
    },
    school: {
      label: 'First day of school', scene: 'school', prop: 'bag', lostAt: 'path', cover: 2,
      en: { title: 'Tiko Goes to School', place: 'a little schoolhouse', want: 'go to school with a shiny blue bag', goal: 'The school bell went ding, ding, ding!', ps: 'Oh no! Where is the bag?', p: 'Tiko stopped to look at a butterfly, and left the bag beside the path.', idea: 'Maybe we can walk back and look,', fs: 'The bag was found!', f: 'They walked back slowly, and there was the blue bag.', joy: 'Tiko ran into class with a big, proud smile.' },
      fil: { title: 'Pumasok si Tiko sa Paaralan', place: 'isang munting paaralan', want: 'pumasok sa paaralan dala ang makintab na bag', goal: 'Tumunog ang kampana: ting, ting, ting!', ps: 'Naku! Nasaan ang bag?', p: 'Huminto si Tiko para tingnan ang paruparo, at naiwan ang bag sa tabi ng daan.', idea: 'Baka makita natin kung babalikan natin,', fs: 'Nakita ang bag!', f: 'Dahan-dahan silang bumalik, at naroon ang asul na bag.', joy: 'Tumakbo si Tiko sa klase na may malaking ngiti.' },
      tl: { title: 'Si Tiko Goes to School', place: 'isang little na school', want: 'pumasok sa school dala ang shiny na blue bag', goal: 'Tumunog ang bell: ding, ding, ding!', ps: 'Oh no! Nasaan ang bag?', p: 'Huminto si Tiko para tingnan ang butterfly, tapos naiwan ang bag sa tabi ng daan.', idea: 'Baka makita natin kung babalikan natin,', fs: 'Nakita ang bag!', f: 'Dahan-dahan silang bumalik, at nandoon ang blue bag.', joy: 'Tumakbo si Tiko sa class with a big smile.' },
    },
    party: {
      label: 'Birthday fiesta', scene: 'party', prop: 'balloon', lostAt: 'roof', cover: 1,
      en: { title: "Tiko and Lola's Birthday", place: 'a happy house full of banderitas', want: "bring a red balloon to Lola's party", goal: 'Everyone sang and clapped for Lola!', ps: 'Oh no! The balloon got away!', p: 'Pop went the string! The balloon floated up and stuck on the roof.', idea: 'Maybe we can reach it together,', fs: 'The balloon came back!', f: 'One helped the other, and the red balloon came down.', joy: 'Lola laughed and hugged them both.' },
      fil: { title: 'Si Tiko at ang Kaarawan ni Lola', place: 'isang masayang bahay na puno ng banderitas', want: 'magdala ng pulang lobo sa handaan ni Lola', goal: 'Kumanta at pumalakpak ang lahat para kay Lola!', ps: 'Naku! Nakawala ang lobo!', p: 'Pak! Napatid ang tali, at sumabit ang lobo sa bubong.', idea: 'Baka maabot natin kung sabay tayo,', fs: 'Bumalik ang lobo!', f: 'Nagtulungan sila, at bumaba ang pulang lobo.', joy: 'Tumawa si Lola at niyakap silang dalawa.' },
      tl: { title: 'Si Tiko at ang Birthday ni Lola', place: 'isang happy na bahay na puno ng banderitas', want: 'magdala ng red balloon sa party ni Lola', goal: 'Nag-sing at pumalakpak ang lahat para kay Lola!', ps: 'Oh no! Nakawala ang balloon!', p: 'Pak! Napatid ang string, tapos sumabit ang balloon sa roof.', idea: 'Baka ma-reach natin kung sabay tayo,', fs: 'Bumalik ang balloon!', f: 'Nagtulungan sila, tapos bumaba ang red balloon.', joy: 'Tumawa si Lola at niyakap silang dalawa.' },
    },
  };
  const WORDS = {
    en: {
      open: [['In {place} lived a tiny tarsier named Tiko.', 'His eyes were big and round, and they never missed a thing.'], ['This is Tiko, a tiny tarsier from {place}.', 'He wore a striped scarf every single day.'], ['In {place}, a small tarsier named Tiko woke up with a smile.', 'Today felt like a special day.']],
      want: ['Today, Tiko wanted to {want}.', 'He hopped once, hopped twice, and off he went.'],
      friend: ['Along came {f}, {kind}. "Can I come too?"', '"Yes!" said Tiko. Two friends are better than one.'],
      refrain: ['One, two, three! "We can do it!" they sang.', 'They sang it again, and their hearts felt strong.'],
      sadS: ['Tiko felt sad.', 'His big eyes filled with little tears.'],
      idea: '"{i}" said {f}.',
      thanks: ['"Thank you, {f}!" said Tiko.', 'And that night, Tiko slept with a smile.'],
      close: ['The end of a very good day.'],
    },
    fil: {
      open: [['Sa {place}, may munting tarsier na ang pangalan ay Tiko.', 'Malaki at bilog ang mga mata niya, at wala siyang pinalalampas.'], ['Ito si Tiko, isang munting tarsier mula sa {place}.', 'Araw-araw niyang suot ang guhit-guhit na bandana.'], ['Sa {place}, gumising nang nakangiti ang munting tarsier na si Tiko.', 'Parang espesyal ang araw na ito.']],
      want: ['Ngayong araw, gusto ni Tiko na {want}.', 'Lumundag siya nang isa, lumundag nang dalawa, at umalis na.'],
      friend: ['Dumating si {f}, ang {kind}. "Pwede ba akong sumama?"', '"Oo!" sabi ni Tiko. Mas masaya kapag may kasama.'],
      refrain: ['Isa, dalawa, tatlo! "Kaya natin ito!" kanta nila.', 'Kumanta silang muli, at lumakas ang loob nila.'],
      sadS: ['Nalungkot si Tiko.', 'Napuno ng munting luha ang malalaki niyang mata.'],
      idea: '"{i}" sabi ni {f}.',
      thanks: ['"Salamat, {f}!" sabi ni Tiko.', 'Nang gabing iyon, natulog si Tiko nang nakangiti.'],
      close: ['Wakas ng isang napakagandang araw.'],
    },
    tl: {
      open: [['Sa {place}, may tiny na tarsier na ang name ay Tiko.', 'Big at round ang eyes niya, kaya walang nakakalampas sa kanya.'], ['Ito si Tiko, isang tiny na tarsier from {place}.', 'Everyday niyang suot ang striped na scarf.'], ['Sa {place}, nagising nang nakangiti ang tiny na tarsier na si Tiko.', 'Parang special ang araw na ito.']],
      want: ['Today, gusto ni Tiko na {want}.', 'Nag-hop siya once, nag-hop twice, tapos umalis na.'],
      friend: ['Dumating si {f}, ang {kind}. "Pwede ba akong sumama?"', '"Yes!" sabi ni Tiko. Mas fun kapag may kasama.'],
      refrain: ['One, two, three! "Kaya natin ito!" kanta nila.', 'Kumanta ulit sila, at lumakas ang loob nila.'],
      sadS: ['Naging sad si Tiko.', 'Napuno ng little tears ang big niyang eyes.'],
      idea: '"{i}" sabi ni {f}.',
      thanks: ['"Thank you, {f}!" sabi ni Tiko.', 'That night, natulog si Tiko nang nakangiti.'],
      close: ['The end ng isang very good day.'],
    },
  };
  const LANG = { English: 'en', Filipino: 'fil', Taglish: 'tl' };

  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const pick = (r, list) => list[Math.floor(r() * list.length)];
  const fill = (s, m) => s.replace(/\{(\w+)\}/g, (_, k) => m[k]);

  /* ---------- pictures ---------- */
  const W = 800, H = 704;
  function eye(x, mood) {
    const look = mood === 'sad' ? 4 : 0;
    return `<circle cx="${x}" cy="0" r="27" fill="#FFB52E"/><circle cx="${x}" cy="0" r="27" fill="none" stroke="#8A5A2B" stroke-width="3"/><circle cx="${x}" cy="${look}" r="17" fill="#231A3A"/><circle cx="${x + 6}" cy="${look - 7}" r="6" fill="#FFF"/><circle cx="${x - 6}" cy="${look + 6}" r="3" fill="#FFF"/>`;
  }
  function tiko(x, y, s, mood, flip) {
    const up = mood === 'happy' || mood === 'wow';
    const arm = d => up ? `<path d="M${d * 34} 76Q${d * 62} 40 ${d * 74} 8" fill="none" stroke="#B9823F" stroke-width="13" stroke-linecap="round"/><circle cx="${d * 76}" cy="2" r="10" fill="#F2C9A0"/>` : `<path d="M${d * 34} 76Q${d * 52} 104 ${d * 48} 128" fill="none" stroke="#B9823F" stroke-width="13" stroke-linecap="round"/><circle cx="${d * 48}" cy="132" r="10" fill="#F2C9A0"/>`;
    const mouth = mood === 'sad' ? '<path d="M-13 50Q0 38 13 50" fill="none" stroke="#231A3A" stroke-width="4.5" stroke-linecap="round"/>'
      : mood === 'wow' ? '<ellipse cx="0" cy="46" rx="9" ry="11" fill="#7A2436"/>'
        : '<path d="M-16 38Q0 60 16 38Q0 44 -16 38Z" fill="#7A2436" stroke="#231A3A" stroke-width="3" stroke-linejoin="round"/>';
    const brow = mood === 'sad' ? '<path d="M-52 -40L-20 -30M52 -40L20 -30" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/>' : '';
    const tear = mood === 'sad' ? '<path d="M-36 30q-8 12 0 16q8 -4 0 -16Z" fill="#7CC8F2"/>' : '';
    return `<g transform="translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})">
<path d="M34 138c58 12 82 -24 56 -56" fill="none" stroke="#B9823F" stroke-width="10" stroke-linecap="round"/>
<ellipse cx="-22" cy="178" rx="24" ry="11" fill="#B9823F"/><ellipse cx="22" cy="178" rx="24" ry="11" fill="#B9823F"/>
<ellipse cx="0" cy="118" rx="50" ry="62" fill="#C9934C"/><ellipse cx="0" cy="130" rx="30" ry="40" fill="#E6BE8A"/>
${arm(-1)}${arm(1)}
<circle cx="-78" cy="-34" r="34" fill="#B9823F"/><circle cx="78" cy="-34" r="34" fill="#B9823F"/><circle cx="-78" cy="-34" r="19" fill="#F2C9A0"/><circle cx="78" cy="-34" r="19" fill="#F2C9A0"/>
<ellipse cx="0" cy="0" rx="82" ry="76" fill="#C9934C"/>
<g transform="translate(0 -6)">${eye(-34, mood)}${eye(34, mood)}${brow}${tear}</g>
<path d="M-6 22q6 7 12 0z" fill="#7A4E2B"/>${mouth}
<rect x="-50" y="68" width="100" height="24" rx="12" fill="#2F6FD6"/><rect x="-28" y="68" width="18" height="24" fill="#FFC63A"/><rect x="10" y="68" width="18" height="24" fill="#FFC63A"/>
<path d="M36 88l18 40l-24 -6z" fill="#2F6FD6"/></g>`;
  }
  function friendArt(kind, x, y, s, flip) {
    const open = `<g transform="translate(${x} ${y}) scale(${s * (flip ? -1 : 1)} ${s})">`;
    const face = (cx, cy, r) => `<circle cx="${cx - r * .42}" cy="${cy - r * .1}" r="${r * .15}" fill="#231A3A"/><circle cx="${cx + r * .42}" cy="${cy - r * .1}" r="${r * .15}" fill="#231A3A"/><circle cx="${cx - r * .37}" cy="${cy - r * .16}" r="${r * .05}" fill="#FFF"/><circle cx="${cx + r * .47}" cy="${cy - r * .16}" r="${r * .05}" fill="#FFF"/><path d="M${cx - r * .28} ${cy + r * .32}Q${cx} ${cy + r * .6} ${cx + r * .28} ${cy + r * .32}" fill="none" stroke="#231A3A" stroke-width="4" stroke-linecap="round"/>`;
    if (kind === 'carabao') return open + `<rect x="-120" y="120" width="34" height="74" rx="14" fill="#4E5568"/><rect x="62" y="120" width="34" height="74" rx="14" fill="#4E5568"/><ellipse cx="-14" cy="100" rx="130" ry="76" fill="#646C82"/><path d="M-160 -18Q-210 -10 -190 46Q-176 6 -120 18Z" fill="#E6DFCB"/><path d="M50 -18Q100 -10 80 46Q66 6 10 18Z" fill="#E6DFCB" transform="translate(-20 0)"/><ellipse cx="-74" cy="44" rx="78" ry="64" fill="#747D94"/><ellipse cx="-74" cy="82" rx="46" ry="28" fill="#A9B0C2"/>${face(-74, 30, 60)}</g>`;
    if (kind === 'bird') return open + `<path d="M-40 10L-94 -34L-58 42Z" fill="#8A5A2B"/><ellipse cx="0" cy="20" rx="66" ry="52" fill="#B9823F"/><ellipse cx="6" cy="36" rx="42" ry="30" fill="#F2E3C9"/><circle cx="34" cy="-22" r="42" fill="#A8703A"/><polygon points="70,-26 104,-14 70,-4" fill="#F58A2E"/>${face(36, -26, 34).replace(/<path.*$/, '')}<path d="M-6 68v22M18 68v22" stroke="#F58A2E" stroke-width="7" stroke-linecap="round"/></g>`;
    if (kind === 'turtle') return open + `<ellipse cx="-74" cy="96" rx="26" ry="16" fill="#6CB66B"/><ellipse cx="60" cy="96" rx="26" ry="16" fill="#6CB66B"/><path d="M-110 88a100 92 0 0 1 200 0Z" fill="#2F8F5B"/><path d="M-60 86l34 -56h52l34 56z" fill="#3FAE70"/><circle cx="118" cy="46" r="46" fill="#7CC87A"/>${face(122, 42, 40)}</g>`;
    if (kind === 'firefly') return open + `<circle cx="0" cy="30" r="86" fill="#FFE27A" opacity=".35"/><ellipse cx="-38" cy="-26" rx="44" ry="24" fill="#DDF3FF" opacity=".9" transform="rotate(30 -38 -26)"/><ellipse cx="38" cy="-26" rx="44" ry="24" fill="#DDF3FF" opacity=".9" transform="rotate(-30 38 -26)"/><ellipse cx="0" cy="62" rx="34" ry="40" fill="#FFD84A"/><ellipse cx="0" cy="24" rx="34" ry="30" fill="#3B4A7A"/><circle cx="0" cy="-22" r="34" fill="#4C5C92"/>${face(0, -24, 30).replace(/#231A3A/g, '#FFF').replace(/fill="#FFF"\/><\/?$/, '')}</g>`;
    return open + `<path d="M56 96c54 -8 56 -62 26 -76" fill="none" stroke="#F58A2E" stroke-width="16" stroke-linecap="round"/><ellipse cx="0" cy="104" rx="62" ry="76" fill="#F58A2E"/><ellipse cx="0" cy="124" rx="34" ry="46" fill="#FFE9CF"/><polygon points="-70,-44 -62,-104 -18,-68" fill="#F58A2E"/><polygon points="70,-44 62,-104 18,-68" fill="#F58A2E"/><ellipse cx="0" cy="-20" rx="76" ry="64" fill="#F79A47"/>${face(0, -18, 62)}<path d="M-92 -8h34M-92 12h34M92 -8h-34M92 12h-34" stroke="#8A5A2B" stroke-width="3" stroke-linecap="round"/></g>`;
  }
  function propArt(p, x, y, s, r, lit) {
    const o = `<g transform="translate(${x} ${y}) rotate(${r || 0}) scale(${s})">`;
    switch (p) {
      case 'kite': return o + '<polygon points="0,-90 72,0 0,110 -72,0" fill="#D8234F"/><polygon points="0,-90 72,0 0,0" fill="#FFC63A"/><polygon points="-72,0 0,0 0,110" fill="#2F6FD6"/><path d="M0 110c-26 26 26 44 0 70s24 42 6 62" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round"/><path d="M-10 142l-22 -10v22zM6 192l22 -10v22z" fill="#FFC63A"/></g>';
      case 'umbrella': return o + '<path d="M-110 0a110 96 0 0 1 220 0q-36 -24 -73 0q-37 -24 -74 0q-37 -24 -73 0Z" fill="#FFC63A"/><path d="M-37 0a37 96 0 0 1 74 0q-37 -24 -74 0Z" fill="#F58A2E"/><path d="M0 -6v120q0 24 -28 24" fill="none" stroke="#8A5A2B" stroke-width="9" stroke-linecap="round"/></g>';
      case 'boat': return o + '<path d="M-120 20h240q-20 70 -60 70h-120q-40 0 -60 -70Z" fill="#B5502E"/><path d="M-120 20h240l-8 18h-224z" fill="#FFF"/><path d="M0 20v-128" stroke="#7A4E2B" stroke-width="9"/><path d="M6 -104l92 104h-92z" fill="#FFD84A"/><path d="M-6 -80l-70 80h70z" fill="#D8234F"/></g>';
      case 'parol': {
        const c = lit ? '#FFD84A' : '#8C94B0', c2 = lit ? '#F2433D' : '#6B7390';
        return o + (lit ? '<circle r="130" fill="#FFE27A" opacity=".35"/>' : '') + `<polygon points="0,-96 26,-30 96,-30 40,12 62,84 0,42 -62,84 -40,12 -96,-30 -26,-30" fill="${c}" stroke="${c2}" stroke-width="8" stroke-linejoin="round"/><circle r="26" fill="${c2}"/><path d="M-40 84l-14 56M0 60v84M40 84l14 56" stroke="${c2}" stroke-width="7" stroke-linecap="round"/></g>`;
      }
      case 'basket': return o + '<path d="M-74 -30a74 74 0 0 1 148 0" fill="none" stroke="#8A5A2B" stroke-width="10"/><ellipse cx="-40" cy="-32" rx="30" ry="24" fill="#FFB52E"/><ellipse cx="20" cy="-36" rx="30" ry="24" fill="#FF9D2E"/><ellipse cx="52" cy="-24" rx="26" ry="20" fill="#FFC63A"/><path d="M-90 -22h180l-24 96h-132z" fill="#C98B46"/><path d="M-84 6h168M-76 36h152M-48 -22l12 96M0 -22v96M48 -22l-12 96" stroke="#8A5A2B" stroke-width="5"/></g>';
      case 'hat': return o + '<path d="M-130 30Q0 -130 130 30Q0 62 -130 30Z" fill="#E6BE6A"/><path d="M-130 30Q0 62 130 30" fill="none" stroke="#8A5A2B" stroke-width="7"/><path d="M0 -56L-66 36M0 -56L66 36M0 -56V46" stroke="#B98B3C" stroke-width="5"/></g>';
      case 'bag': return o + '<rect x="-74" y="-80" width="148" height="160" rx="30" fill="#2F6FD6"/><path d="M-36 -80q0 -46 36 -46t36 46" fill="none" stroke="#18245C" stroke-width="11"/><rect x="-50" y="6" width="100" height="56" rx="14" fill="#5F9BF2"/><rect x="-16" y="-14" width="32" height="26" rx="6" fill="#FFC63A"/></g>';
      default: return o + '<path d="M0 86c-14 44 18 70 -6 120" fill="none" stroke="#FFF" stroke-width="5"/><ellipse cx="0" cy="0" rx="72" ry="88" fill="#D8234F"/><ellipse cx="-24" cy="-34" rx="14" ry="24" fill="#FF8FA8"/><polygon points="-12,86 12,86 0,72" fill="#D8234F"/></g>';
    }
  }
  function cloud(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})" fill="#FFF" opacity=".92"><ellipse cx="0" cy="0" rx="70" ry="30"/><circle cx="-26" cy="-20" r="28"/><circle cx="20" cy="-26" r="36"/></g>`; }
  function palm(x, y, s) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10 0Q-4 -120 28 -230h18Q18 -120 14 0Z" fill="#8A5A2B"/><g fill="#2F8F5B"><path d="M36 -232Q-40 -300 -130 -220Q-40 -252 36 -226Z"/><path d="M36 -232Q120 -300 200 -210Q110 -250 36 -226Z"/><path d="M36 -232Q10 -330 -70 -340Q10 -300 30 -228Z"/><path d="M36 -232Q90 -330 170 -320Q90 -296 44 -228Z"/></g></g>`; }
  function hut(x, y, s, wall, roof) { return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-110" y="-120" width="220" height="130" fill="${wall}"/><path d="M-150 -116L0 -226L150 -116Z" fill="${roof}"/><rect x="-26" y="-74" width="52" height="84" fill="#8A5A2B"/><rect x="-92" y="-92" width="44" height="40" fill="#FFF3C4"/><rect x="48" y="-92" width="44" height="40" fill="#FFF3C4"/></g>`; }
  function mango(x, y) { return `<g transform="translate(${x} ${y})"><path d="M-26 300Q-16 120 -22 0H26Q14 120 34 300Z" fill="#7A4E2B"/><circle cx="0" cy="-60" r="150" fill="#2F8F5B"/><circle cx="-110" cy="10" r="96" fill="#3AA36B"/><circle cx="110" cy="10" r="96" fill="#3AA36B"/><circle cx="-54" cy="-30" r="16" fill="#FFC63A"/><circle cx="70" cy="-70" r="16" fill="#FFC63A"/><circle cx="40" cy="30" r="14" fill="#FFC63A"/></g>`; }

  const SCENES = {
    hill(r) { return grad('#8FD0FF', '#E3F6FF') + sun(640, 110) + cloud(170, 120, 1) + cloud(470, 70, .7) + hills('#7CC87A', '#3FAE70', 400) + mango(170, 250); },
    rain(r) { return grad('#7E93B5', '#C7D8E6') + cloud(200, 90, 1.5).replace(/#FFF/, '#E4EAF2') + cloud(600, 110, 1.3).replace(/#FFF/, '#E4EAF2') + hills('#4F9A68', '#2F7A52', 420) + bushes() + rain(r); },
    sea() { return grad('#6FC6F5', '#DFF5FF') + sun(150, 110) + cloud(560, 100, 1) + '<rect y="300" width="800" height="210" fill="#2FA8D6"/><path d="M0 330q50 -22 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0v30H0z" fill="#5FC6EA"/><path d="M0 500Q400 440 800 500V704H0Z" fill="#FFE3A6"/>' + palm(700, 560, 1); },
    night(r) { let s = grad('#141C4E', '#3A3F86') + '<circle cx="640" cy="110" r="52" fill="#FFF3C4"/><circle cx="660" cy="98" r="46" fill="#1A2258"/>'; for (let i = 0; i < 26; i++) s += `<circle cx="${Math.round(r() * 800)}" cy="${Math.round(r() * 280)}" r="${(2 + r() * 3).toFixed(1)}" fill="#FFF"/>`; return s + hills('#27467A', '#1D3460', 430) + hut(610, 480, 1.1, '#6D5A8E', '#3D3468'); },
    market() { let s = grad('#BFE3FF', '#FFF2D6') + '<rect y="480" width="800" height="224" fill="#E7C9A0"/>'; [['#D8234F', 150], ['#2F6FD6', 610]].forEach(([c, x]) => { s += `<g transform="translate(${x} 470)"><rect x="-120" y="-190" width="14" height="190" fill="#7A4E2B"/><rect x="106" y="-190" width="14" height="190" fill="#7A4E2B"/><path d="M-150 -190L-110 -270H110L150 -190Z" fill="${c}"/><path d="M-110 -270h44l-14 80h-60zM-22 -270h44l10 80h-64zM66 -270h44l40 80h-60z" fill="#FFF"/><rect x="-130" y="-60" width="260" height="70" fill="#B5804A"/><circle cx="-80" cy="-74" r="22" fill="#FFB52E"/><circle cx="-34" cy="-74" r="22" fill="#FF9D2E"/><circle cx="14" cy="-74" r="22" fill="#6CB66B"/><circle cx="62" cy="-74" r="22" fill="#D8234F"/></g>`; }); return s; },
    farm() { let s = grad('#9FDBFF', '#FFF0C9') + sun(160, 120) + cloud(600, 90, .9) + '<path d="M0 340Q400 280 800 340V704H0Z" fill="#E9C34C"/><path d="M0 470Q400 420 800 470V704H0Z" fill="#D9AE32"/>'; for (let y = 360; y < 680; y += 44) for (let x = (y % 88 ? 20 : 50); x < 800; x += 62) s += `<path d="M${x} ${y}q-8 -24 -18 -30M${x} ${y}q0 -26 2 -36M${x} ${y}q8 -24 18 -30" fill="none" stroke="#B98B26" stroke-width="4" stroke-linecap="round"/>`; return s + hut(640, 380, .8, '#C69C5B', '#8A6A34'); },
    school() { return grad('#A9E0FF', '#EFFAFF') + sun(130, 100) + cloud(420, 90, .9) + hills('#8FD27E', '#5FBA6B', 440) + '<g transform="translate(560 450)"><rect x="-190" y="-170" width="380" height="180" fill="#FFE3A6"/><path d="M-220 -166L0 -270L220 -166Z" fill="#D8234F"/><rect x="-30" y="-90" width="60" height="100" fill="#7A4E2B"/><rect x="-150" y="-130" width="80" height="60" fill="#BFE3FF"/><rect x="70" y="-130" width="80" height="60" fill="#BFE3FF"/><path d="M0 -270v-70" stroke="#7A4E2B" stroke-width="6"/><path d="M0 -340l50 16l-50 16z" fill="#2F6FD6"/></g><path d="M250 704Q320 560 500 470H560Q450 580 470 704Z" fill="#E7C9A0"/>'; },
    party() { let s = grad('#BDEBFF', '#FFF6E0') + sun(120, 100) + hills('#8FD27E', '#5FBA6B', 460) + hut(570, 480, 1.5, '#FFE3A6', '#D8234F'); const c = ['#D8234F', '#2F6FD6', '#FFC63A', '#2FA84F', '#F58A2E']; for (let i = 0; i < 12; i++) { const x = 40 + i * 66, y = 200 + Math.sin(i / 11 * Math.PI) * 60; s += `<polygon points="${x},${y} ${x + 44},${y} ${x + 22},${y + 46}" fill="${c[i % 5]}"/>`; } return s; },
  };
  function grad(a, b) { return `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><rect width="${W}" height="${H}" fill="url(#s)"/>`; }
  function sun(x, y) { return `<circle cx="${x}" cy="${y}" r="88" fill="#FFE27A" opacity=".4"/><circle cx="${x}" cy="${y}" r="58" fill="#FFD23F"/>`; }
  function hills(a, b, y) { return `<path d="M0 ${y}Q220 ${y - 90} 450 ${y - 10}T800 ${y - 30}V${H}H0Z" fill="${a}"/><path d="M0 ${y + 110}Q280 ${y + 30} 540 ${y + 100}T800 ${y + 80}V${H}H0Z" fill="${b}"/>`; }
  function bushes() { return '<g fill="#2F7A52"><circle cx="630" cy="440" r="86"/><circle cx="730" cy="470" r="76"/><circle cx="540" cy="480" r="62"/></g>'; }
  function rain(r) { let s = ''; for (let i = 0; i < 46; i++) { const x = Math.round(r() * 800), y = Math.round(r() * 680); s += `<path d="M${x} ${y}l-10 26" stroke="#E6F2FF" stroke-width="4" stroke-linecap="round" opacity=".8"/>`; } return s; }

  const LOST = { tree: [170, 215, -30, .62], bush: [640, 390, 25, .62], water: [610, 345, 0, .55], roof: [600, 300, 12, .6], stall: [610, 495, 0, .62], field: [470, 450, 10, .6], path: [440, 590, 0, .5] };
  const FX = { party: { roof: [570, 235, 0, .7] } };

  function picture(theme, beat, friend, seed) {
    const r = rng(seed), t = THEMES[theme];
    let s = SCENES[t.scene](r);
    const gy = 470, hasF = beat !== 'open' && beat !== 'want', k = FRIENDS[friend].kind;
    const fy = { carabao: 400, bird: 440, turtle: 500, firefly: 300, cat: 400 }[k], fs = { carabao: .8, bird: .9, turtle: .9, firefly: .9, cat: .8 }[k];
    const plan = {
      cover: { tx: 260, ty: 400, ts: 1.15, m: 'happy', p: 'have', f: 1, fx: 590 },
      open: { tx: 400, ty: gy - 40, ts: 1.25, m: 'happy', p: 'none' },
      want: { tx: 300, ty: gy, ts: 1.05, m: 'happy', p: 'have' },
      friend: { tx: 200, ty: gy, ts: 1, m: 'wow', p: 'have', f: 1, fx: 640 },
      goal: { tx: 260, ty: gy, ts: 1, m: 'happy', p: 'fly', f: 1, fx: 570 },
      problem: { tx: 300, ty: gy + 30, ts: 1, m: 'wow', p: 'lost', f: 1, fx: 90 },
      sad: { tx: 400, ty: gy, ts: 1.2, m: 'sad', p: 'none', f: 1, fx: 640 },
      idea: { tx: 250, ty: gy, ts: 1, m: 'wow', p: 'lost', f: 1, fx: 560 },
      refrain: { tx: 270, ty: gy - 50, ts: 1, m: 'happy', p: 'none', f: 1, fx: 570 },
      fix: { tx: 200, ty: gy, ts: 1, m: 'happy', p: 'back', f: 1, fx: 650 },
      joy: { tx: 280, ty: gy, ts: 1.05, m: 'happy', p: 'fly', f: 1, fx: 590 },
    }[beat];
    const lost = (FX[t.scene] && FX[t.scene][t.lostAt]) || LOST[t.lostAt];
    const lit = beat !== 'problem' && beat !== 'idea';
    if (plan.p === 'lost') s += propArt(t.prop, lost[0], lost[1], lost[3], lost[2], lit);
    if (plan.p === 'fly') {
      const air = ['kite', 'balloon', 'parol'].includes(t.prop);
      s += air ? propArt(t.prop, 520, 165, .85, 16, true) : propArt(t.prop, 520, 560, .8, 0, true);
    }
    const near = t.prop === 'hat' ? [420, 400] : [420, 530];
    if (plan.p === 'have') s += propArt(t.prop, beat === 'cover' ? 440 : near[0], near[1] + (beat === 'cover' ? 70 : 0), beat === 'cover' ? .5 : .62, 0, true);
    if (plan.p === 'back') s += propArt(t.prop, 420, 520, .72, -8, true);
    if (plan.f && hasF) s += friendArt(k, plan.fx, fy + (beat === 'cover' ? 40 : 40), fs, plan.fx > plan.tx);
    s += tiko(plan.tx, plan.ty, plan.ts, plan.m, false);
    if (t.scene === 'rain') s += rain(rng(seed + 9)).replace(/opacity="\.8"/g, 'opacity=".45"');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  }

  /* ---------- stories ---------- */
  const BEATS = { 6: ['want', 'friend', 'problem', 'idea', 'fix', 'joy'], 8: ['open', 'want', 'friend', 'problem', 'sad', 'idea', 'fix', 'joy'], 10: ['open', 'want', 'friend', 'goal', 'problem', 'sad', 'idea', 'refrain', 'fix', 'joy'] };

  function generate(o) {
    const seed = (o.seed === undefined ? Math.floor(Math.random() * 1e9) : o.seed) >>> 0, r = rng(seed);
    const themeKey = THEMES[o.theme] ? o.theme : pick(r, Object.keys(THEMES));
    const friendKey = FRIENDS[o.friend] ? o.friend : pick(r, Object.keys(FRIENDS));
    const lessonKey = LESSONS[o.lesson] ? o.lesson : pick(r, Object.keys(LESSONS));
    const lang = LANG[o.language] ? o.language : pick(r, Object.keys(LANG));
    const l = LANG[lang], T = THEMES[themeKey], t = T[l], F = FRIENDS[friendKey], L = LESSONS[lessonKey][l], W2 = WORDS[l];
    const age = o.age || '4-6', count = [6, 8, 10].includes(Number(o.pages)) ? Number(o.pages) : 8;
    const m = { place: t.place, want: t.want, f: F.name, kind: F[l], i: t.idea };
    const pair = (a) => fill(age === '6-8' && a[1] ? a[0] + ' ' + a[1] : a[0], m);
    const short = age === '2-4';
    const text = {
      open: () => pair(pick(r, W2.open)),
      want: () => pair(W2.want),
      friend: () => pair(W2.friend),
      goal: () => t.goal,
      problem: () => short ? t.ps : t.p,
      sad: () => short ? fill(W2.sadS[0], m) : age === '6-8' ? pair(W2.sadS) + ' ' + fill(L[0], m) : fill(L[0], m),
      idea: () => fill(W2.idea, m),
      refrain: () => pair(W2.refrain),
      fix: () => short ? t.fs : t.f,
      joy: () => [t.joy, short ? '' : fill(L[1], m), pair(W2.thanks)].filter(Boolean).join(' '),
    };
    const pages = BEATS[count].map((b, i) => ({
      text: text[b](), scene: '', layout: 'stack',
      art: { t: 'svg', svg: picture(themeKey, b, friendKey, seed + i * 31) },
    }));
    const now = Date.now();
    return {
      id: 'b' + now.toString(36) + Math.floor(r() * 1e6).toString(36), title: t.title, author: 'Tiko Stories', color: T.cover,
      lang, style: 'cut', age, characters: '', sample: false, cover: { t: 'svg', svg: picture(themeKey, 'cover', friendKey, seed) },
      pages, createdAt: now, updatedAt: now,
    };
  }
  const label = o => Object.keys(o).map(k => ({ id: k, name: o[k].label || o[k].name }));
  return { generate, tiko: (m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -120 260 320">${tiko(0, 0, 1, m || 'happy')}</svg>`, propIcon: k => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-140 -140 280 280">${propArt(THEMES[k].prop, 0, 0, k === 'kite' ? .8 : 1, 0, true)}</svg>`, themes: label(THEMES), friends: label(FRIENDS), lessons: label(LESSONS), languages: Object.keys(LANG), friendIcon: k => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-220 -130 440 340">${friendArt(FRIENDS[k].kind, 0, 0, 1, false)}</svg>` };
})();
