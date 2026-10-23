// All series shown on the site.
// To add one: copy an entry, put the poster in images/, and fill in
//   trailer: the YouTube video id (the part after "v=" in the link)
//   imdb:    the IMDb id (the "tt..." part of the IMDb link)
//   genre:   drama, crime, sci-fi, thriller, comedy, animation or action
//   end:     null if the show is still running

const SERIES = [
    {
        id: 'breaking-bad', title: 'Breaking Bad', start: 2008, end: 2013, age: 'TV-MA', runtime: '49 min',
        genre: 'drama', rating: 9.5, image: 'images/bad.webp', trailer: 'HhesaQXLuRY', imdb: 'tt0903747',
        description: "A high school chemistry teacher with a cancer diagnosis starts making meth to secure his family's future.",
    },
    {
        id: 'the-wire', title: 'The Wire', start: 2002, end: 2008, age: 'TV-MA', runtime: '59 min',
        genre: 'crime', rating: 9.3, image: 'images/wire.webp', trailer: 'apZQlqPp6Hs', imdb: 'tt0306414',
        description: 'A realistic look at crime, corruption and a city falling apart in Baltimore, told from both sides of the law.',
    },
    {
        id: 'chernobyl', title: 'Chernobyl', start: 2019, end: 2019, age: 'TV-MA', runtime: '1 h',
        genre: 'drama', rating: 9.3, image: 'images/chernobyl.webp', trailer: 's9APLXM9Ei8', imdb: 'tt7366338',
        description: 'A miniseries about the 1986 nuclear disaster in the Soviet Union and the people who dealt with its aftermath.',
    },
    {
        id: 'game-of-thrones', title: 'Game of Thrones', start: 2011, end: 2019, age: 'TV-MA', runtime: '1 h',
        genre: 'sci-fi', rating: 9.2, image: 'images/got.webp', trailer: 'KPLWWIOCOOQ', imdb: 'tt0944947',
        description: 'Noble families fight for power in Westeros while an ancient, long-forgotten evil returns.',
    },
    {
        id: 'sherlock', title: 'Sherlock', start: 2010, end: 2017, age: 'TV-14', runtime: '1 h 28 min',
        genre: 'crime', rating: 9.1, image: 'images/sherlock.webp', trailer: 'IrBKwzL3K7s', imdb: 'tt1475582',
        description: 'Sherlock Holmes in modern-day London, solving crimes with Dr. Watson through sharp deduction.',
    },
    {
        id: 'stranger-things', title: 'Stranger Things', start: 2016, end: 2025, age: 'TV-14', runtime: '1 h',
        genre: 'sci-fi', rating: 8.7, image: 'images/stranger.webp', trailer: 'b9EkMc79ZSU', imdb: 'tt4574334',
        description: 'When a boy disappears in a small town, his friends uncover a secret experiment and a terrifying parallel world.',
    },
    {
        id: 'the-sopranos', title: 'The Sopranos', start: 1999, end: 2007, age: 'TV-MA', runtime: '1 h',
        genre: 'drama', rating: 9.2, image: 'images/sopranos.webp', trailer: 'KMx4iFcozK0', imdb: 'tt0141842',
        description: 'A New Jersey mob boss tries to balance crime, family life and his own mental health.',
    },
    {
        id: 'the-crown', title: 'The Crown', start: 2016, end: 2023, age: 'TV-MA', runtime: '58 min',
        genre: 'drama', rating: 8.6, image: 'images/crown.webp', trailer: 'JWtnJjn6ng0', imdb: 'tt4786824',
        description: 'The life of Queen Elizabeth II from the start of her reign: politics, family and public crises.',
    },
    {
        id: 'the-mandalorian', title: 'The Mandalorian', start: 2019, end: null, age: 'TV-14', runtime: '40 min',
        genre: 'sci-fi', rating: 8.7, image: 'images/mando.webp', trailer: 'aOC8E8z_ifw', imdb: 'tt8111088',
        description: 'A lone bounty hunter travels the outer reaches of the galaxy after the fall of the Empire.',
    },
    {
        id: 'friends', title: 'Friends', start: 1994, end: 2004, age: 'TV-14', runtime: '22 min',
        genre: 'comedy', rating: 8.9, image: 'images/friends.webp', trailer: 'Zg2LCD5QOJs', imdb: 'tt0108778',
        description: 'Six friends in New York share apartments, coffee, romance and everyday disasters.',
    },
    {
        id: 'the-boys', title: 'The Boys', start: 2019, end: null, age: 'TV-MA', runtime: '1 h',
        genre: 'action', rating: 8.6, image: 'images/boys.webp', trailer: 'tcrNsIaQkb4', imdb: 'tt1190634',
        description: 'A group of ordinary people sets out to expose and fight corrupt superheroes who abuse their powers.',
    },
    {
        id: 'peaky-blinders', title: 'Peaky Blinders', start: 2013, end: 2022, age: 'TV-MA', runtime: '58 min',
        genre: 'crime', rating: 8.7, image: 'images/peak.webp', trailer: 'oVzVdvGIC7U', imdb: 'tt2442560',
        description: 'The Shelby family runs a Birmingham gang after the First World War, fighting for power, influence and survival.',
    },
    {
        id: 'arcane', title: 'Arcane', start: 2021, end: 2024, age: 'TV-MA', runtime: '40 min',
        genre: 'animation', rating: 9.0, image: 'images/arcane.webp', trailer: 'ysqiEC6bLUI', imdb: 'tt11126994',
        description: 'Based on League of Legends: two sisters end up on opposite sides of a conflict between the city of Piltover and the undercity of Zaun.',
    },
    {
        id: 'dexter', title: 'Dexter', start: 2006, end: 2013, age: 'TV-MA', runtime: '1 h',
        genre: 'thriller', rating: 8.6, image: 'images/dexter.webp', trailer: '84o1Q6fB20k', imdb: 'tt0773262',
        description: 'A Miami forensics expert lives a double life as a serial killer who only hunts other criminals.',
    },
    {
        id: 'better-call-saul', title: 'Better Call Saul', start: 2015, end: 2022, age: 'TV-MA', runtime: '50 min',
        genre: 'crime', rating: 9.0, image: 'images/saul.webp', trailer: 'HN4oydykJFc', imdb: 'tt3032476',
        description: 'Small-time lawyer Jimmy McGill struggles through the years before he meets Walter White and Jesse Pinkman.',
    },
    {
        id: 'you', title: 'You', start: 2018, end: 2025, age: 'TV-MA', runtime: '45 min',
        genre: 'thriller', rating: 7.6, image: 'images/you.webp', trailer: 'ga1m0wjzscU', imdb: 'tt7335184',
        description: 'A charming bookstore manager becomes dangerously obsessed with a woman he meets by chance.',
    },
    {
        id: 'the-office', title: 'The Office', start: 2005, end: 2013, age: 'TV-14', runtime: '22 min',
        genre: 'comedy', rating: 9.0, image: 'images/office.webp', trailer: 'MIEVoulYZM0', imdb: 'tt0386676',
        description: 'A mockumentary about the everyday life of the staff at the Dunder Mifflin paper company.',
    },
    {
        id: 'rick-and-morty', title: 'Rick and Morty', start: 2013, end: null, age: 'TV-MA', runtime: '22 min',
        genre: 'animation', rating: 9.1, image: 'images/rick.webp', trailer: 'ySYnTO7leqI', imdb: 'tt2861424',
        description: 'Genius scientist Rick drags his grandson Morty on strange and dangerous trips across the multiverse.',
    },
    {
        id: 'the-last-of-us', title: 'The Last of Us', start: 2023, end: null, age: 'TV-MA', runtime: '1 h',
        genre: 'sci-fi', rating: 8.6, image: 'images/us.webp', trailer: 'uLtkt8BonwM', imdb: 'tt3581920',
        description: "After a pandemic wipes out civilization, a hardened survivor looks after a 14-year-old girl who may be humanity's last hope.",
    },
    {
        id: 'severance', title: 'Severance', start: 2022, end: null, age: 'TV-MA', runtime: '1 h',
        genre: 'thriller', rating: 8.7, image: 'images/severance.webp', trailer: 'xEQP4VVuyrY', imdb: 'tt11280740',
        description: 'Mark leads a team of office workers whose memories have been surgically split between work and home.',
    },
    {
        id: 'devil-may-cry', title: 'Devil May Cry', start: 2025, end: null, age: 'TV-MA', runtime: '30 min',
        genre: 'animation', rating: 7.4, image: 'images/devil.webp', trailer: 'OlEqHXRrcpc', imdb: 'tt15716776',
        description: 'When a mysterious villain threatens to open the gates of Hell, a cocky demon hunter may be the world\'s best hope.',
    },
];
