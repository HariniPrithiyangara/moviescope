// Client-side cache helper
const getCache = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const cachedItem = localStorage.getItem(`omdb_cache_${key}`);
    if (!cachedItem) return null;
    const parsed = JSON.parse(cachedItem);
    // 24 hour cache expiry
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(`omdb_cache_${key}`);
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.error('Error reading from cache', e);
    return null;
  }
};

const setCache = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `omdb_cache_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn('Storage quota exceeded, cache ignored', e);
  }
};

const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || '21960c77';
const BASE_URL = 'https://www.omdbapi.com/';

// Mock Database of 20 Popular Movies for Fallback Mode
export const mockMovies = [
  {
    Title: 'Interstellar',
    Year: '2014',
    Rated: 'PG-13',
    Released: '07 Nov 2014',
    Runtime: '169 min',
    Genre: 'Adventure, Drama, Sci-Fi',
    Director: 'Christopher Nolan',
    Writer: 'Jonathan Nolan, Christopher Nolan',
    Actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    Plot: 'In Earth\'s future, a global crop blight and second Dust Bowl are slowly rendering the planet uninhabitable. Professor Brand, a brilliant NASA physicist, is working on plans to save mankind by transporting Earth\'s population to a new home via a wormhole.',
    Language: 'English',
    Country: 'United States, United Kingdom, Canada',
    Awards: 'Won 1 Oscar. 44 wins & 148 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGUtNzI2My00MGUxLTgwNDEtNzE0NTlhODYyYzViXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.7/10' },
      { Source: 'Rotten Tomatoes', Value: '73%' },
      { Source: 'Metacritic', Value: '74/100' }
    ],
    Metascore: '74',
    imdbRating: '8.7',
    imdbVotes: '2,154,821',
    imdbID: 'tt0816692',
    Type: 'movie'
  },
  {
    Title: 'Dune: Part Two',
    Year: '2024',
    Rated: 'PG-13',
    Released: '01 Mar 2024',
    Runtime: '166 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'Denis Villeneuve',
    Writer: 'Denis Villeneuve, Jon Spaihts, Frank Herbert',
    Actors: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem',
    Plot: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    Language: 'English',
    Country: 'United States, Canada',
    Awards: 'Won 2 Oscars. 18 wins & 45 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDdjYmFiYWYtYzBhZS00MGEyLTk4MDUtYWY1OWFlYTFlYTg0XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '92%' },
      { Source: 'Metacritic', Value: '79/100' }
    ],
    Metascore: '79',
    imdbRating: '8.5',
    imdbVotes: '485,321',
    imdbID: 'tt1160419',
    Type: 'movie'
  },
  {
    Title: 'Oppenheimer',
    Year: '2023',
    Rated: 'R',
    Released: '21 Jul 2023',
    Runtime: '180 min',
    Genre: 'Biography, Drama, History',
    Director: 'Christopher Nolan',
    Writer: 'Christopher Nolan, Kai Bird, Martin J. Sherwin',
    Actors: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
    Plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, leading to the creation of the Manhattan Project.',
    Language: 'English, German, Italian',
    Country: 'United States, United Kingdom',
    Awards: 'Won 7 Oscars. 259 wins & 342 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDc4ODg4M2QtYjU5Yi00M2ZiLTliNWUtMTAzYWEzM2FhMDFhXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.9/10' },
      { Source: 'Rotten Tomatoes', Value: '93%' },
      { Source: 'Metacritic', Value: '90/100' }
    ],
    Metascore: '90',
    imdbRating: '8.9',
    imdbVotes: '745,821',
    imdbID: 'tt15398776',
    Type: 'movie'
  },
  {
    Title: 'The Batman',
    Year: '2022',
    Rated: 'PG-13',
    Released: '04 Mar 2022',
    Runtime: '176 min',
    Genre: 'Action, Crime, Drama',
    Director: 'Matt Reeves',
    Writer: 'Matt Reeves, Peter Craig, Bob Kane',
    Actors: 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright, Colin Farrell',
    Plot: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    Language: 'English, Latin',
    Country: 'United States',
    Awards: 'Nominated for 3 Oscars. 34 wins & 165 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxOF5BMl5BanBnXkFtZTgwMTcxOTU5NDM@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '7.8/10' },
      { Source: 'Rotten Tomatoes', Value: '85%' },
      { Source: 'Metacritic', Value: '72/100' }
    ],
    Metascore: '72',
    imdbRating: '7.8',
    imdbVotes: '792,000',
    imdbID: 'tt1877830',
    Type: 'movie'
  },
  {
    Title: 'Inception',
    Year: '2010',
    Rated: 'PG-13',
    Released: '16 Jul 2010',
    Runtime: '148 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'Christopher Nolan',
    Writer: 'Christopher Nolan',
    Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
    Language: 'English, Japanese, French',
    Country: 'United States, United Kingdom',
    Awards: 'Won 4 Oscars. 159 wins & 220 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes', Value: '87%' },
      { Source: 'Metacritic', Value: '74/100' }
    ],
    Metascore: '74',
    imdbRating: '8.8',
    imdbVotes: '2,600,000',
    imdbID: 'tt1375666',
    Type: 'movie'
  },
  {
    Title: 'The Dark Knight',
    Year: '2008',
    Rated: 'PG-13',
    Released: '18 Jul 2008',
    Runtime: '152 min',
    Genre: 'Action, Crime, Drama',
    Director: 'Christopher Nolan',
    Writer: 'Jonathan Nolan, Christopher Nolan, David S. Goyer',
    Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart, Maggie Gyllenhaal',
    Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    Language: 'English, Mandarin',
    Country: 'United States, United Kingdom',
    Awards: 'Won 2 Oscars. 163 wins & 163 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '9.0/10' },
      { Source: 'Rotten Tomatoes', Value: '94%' },
      { Source: 'Metacritic', Value: '84/100' }
    ],
    Metascore: '84',
    imdbRating: '9.0',
    imdbVotes: '2,900,000',
    imdbID: 'tt0468569',
    Type: 'movie'
  },
  {
    Title: 'Spider-Man: Into the Spider-Verse',
    Year: '2018',
    Rated: 'PG',
    Released: '14 Dec 2018',
    Runtime: '117 min',
    Genre: 'Animation, Action, Adventure',
    Director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    Writer: 'Phil Lord, Rodney Rothman',
    Actors: 'Shameik Moore, Jake Johnson, Hailee Steinfeld',
    Plot: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    Language: 'English, Spanish',
    Country: 'United States',
    Awards: 'Won 1 Oscar. 88 wins & 60 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.4/10' },
      { Source: 'Rotten Tomatoes', Value: '97%' },
      { Source: 'Metacritic', Value: '87/100' }
    ],
    Metascore: '87',
    imdbRating: '8.4',
    imdbVotes: '650,000',
    imdbID: 'tt4633694',
    Type: 'movie'
  },
  {
    Title: 'Blade Runner 2049',
    Year: '2017',
    Rated: 'R',
    Released: '06 Oct 2017',
    Runtime: '164 min',
    Genre: 'Action, Drama, Mystery',
    Director: 'Denis Villeneuve',
    Writer: 'Hampton Fancher, Michael Green, Philip K. Dick',
    Actors: 'Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks',
    Plot: 'A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos. K\'s discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for thirty years.',
    Language: 'English, Finnish, Japanese, Somali, Russian',
    Country: 'United States, United Kingdom, Hungary, Canada',
    Awards: 'Won 2 Oscars. 106 wins & 172 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.0/10' },
      { Source: 'Rotten Tomatoes', Value: '88%' },
      { Source: 'Metacritic', Value: '81/100' }
    ],
    Metascore: '81',
    imdbRating: '8.0',
    imdbVotes: '665,000',
    imdbID: 'tt1856101',
    Type: 'movie'
  },
  {
    Title: 'Fight Club',
    Year: '1999',
    Rated: 'R',
    Released: '15 Oct 1999',
    Runtime: '139 min',
    Genre: 'Drama',
    Director: 'David Fincher',
    Writer: 'Chuck Palahniuk, Jim Uhls',
    Actors: 'Brad Pitt, Edward Norton, Meat Loaf, Zach Grenier',
    Plot: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    Language: 'English',
    Country: 'United States, Germany',
    Awards: 'Nominated for 1 Oscar. 12 wins & 38 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BODlhNmVkNGMtMTMyMC00NjQyLWIwOTUtYTQyYWNkMTg0NDI1XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes', Value: '79%' },
      { Source: 'Metacritic', Value: '67/100' }
    ],
    Metascore: '67',
    imdbRating: '8.8',
    imdbVotes: '2,300,000',
    imdbID: 'tt0137523',
    Type: 'movie'
  },
  {
    Title: 'Avatar: The Way of Water',
    Year: '2022',
    Rated: 'PG-13',
    Released: '16 Dec 2022',
    Runtime: '192 min',
    Genre: 'Action, Adventure, Fantasy',
    Director: 'James Cameron',
    Writer: 'James Cameron, Rick Jaffa, Amanda Silver',
    Actors: 'Sam Worthington, Zoe Saldaña, Sigourney Weaver, Kate Winslet',
    Plot: 'Jake Sully lives with his newfound family formed on the extraterrestrial moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Won 1 Oscar. 71 wins & 142 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODUtY2UxOC00NDlhLThkMDAtMTU3YTgwMWODZDE0XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '7.5/10' },
      { Source: 'Rotten Tomatoes', Value: '76%' },
      { Source: 'Metacritic', Value: '67/100' }
    ],
    Metascore: '67',
    imdbRating: '7.5',
    imdbVotes: '470,000',
    imdbID: 'tt1630029',
    Type: 'movie'
  },
  {
    Title: 'The Matrix',
    Year: '1999',
    Rated: 'R',
    Released: '31 Mar 1999',
    Runtime: '136 min',
    Genre: 'Action, Sci-Fi',
    Director: 'Lana Wachowski, Lilly Wachowski',
    Writer: 'Lana Wachowski, Lilly Wachowski',
    Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
    Plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    Language: 'English',
    Country: 'United States, Australia',
    Awards: 'Won 4 Oscars. 29 wins & 51 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYzUzOTA5ZTMtMTdlMS00MDlhLTg0MyQtYWMyMzlkMzE1MWFiXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.7/10' },
      { Source: 'Rotten Tomatoes', Value: '87%' },
      { Source: 'Metacritic', Value: '73/100' }
    ],
    Metascore: '73',
    imdbRating: '8.7',
    imdbVotes: '2,050,000',
    imdbID: 'tt0133093',
    Type: 'movie'
  },
  {
    Title: 'Gladiator',
    Year: '2000',
    Rated: 'R',
    Released: '05 May 2000',
    Runtime: '155 min',
    Genre: 'Action, Adventure, Drama',
    Director: 'Ridley Scott',
    Writer: 'David Franzoni, John Logan, William Nicholson',
    Actors: 'Russell Crowe, Joaquin Phoenix, Connie Nielsen, Oliver Reed',
    Plot: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    Language: 'English',
    Country: 'United States, United Kingdom, Malta, Morocco',
    Awards: 'Won 5 Oscars. 60 wins & 107 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWViMy00YzhkLTkyMKMtMDQwYTU0ODFmZDVmXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '80%' },
      { Source: 'Metacritic', Value: '67/100' }
    ],
    Metascore: '67',
    imdbRating: '8.5',
    imdbVotes: '1,600,000',
    imdbID: 'tt0172495',
    Type: 'movie'
  },
  {
    Title: 'Forrest Gump',
    Year: '1994',
    Rated: 'PG-13',
    Released: '06 Jul 1994',
    Runtime: '142 min',
    Genre: 'Drama, Romance',
    Director: 'Robert Zemeckis',
    Writer: 'Winston Groom, Eric Roth',
    Actors: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
    Plot: 'The history of the United States from the 1950s to the 1970s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Won 6 Oscars. 51 wins & 80 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDYwNzUxM2UtNDQ5Yy00NDc5LTg3MTUtMWFmYmRlODI3ODI3XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes', Value: '71%' },
      { Source: 'Metacritic', Value: '82/100' }
    ],
    Metascore: '82',
    imdbRating: '8.8',
    imdbVotes: '2,300,000',
    imdbID: 'tt0109830',
    Type: 'movie'
  },
  {
    Title: 'Pulp Fiction',
    Year: '1994',
    Rated: 'R',
    Released: '14 Oct 1994',
    Runtime: '154 min',
    Genre: 'Crime, Drama',
    Director: 'Quentin Tarantino',
    Writer: 'Quentin Tarantino, Roger Avary',
    Actors: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
    Plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    Language: 'English, Spanish, French',
    Country: 'United States',
    Awards: 'Won 1 Oscar. 71 wins & 75 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDFkNC00YTc4LTg1NGUtOWExN2Q5YTgwNWRhXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.9/10' },
      { Source: 'Rotten Tomatoes', Value: '92%' },
      { Source: 'Metacritic', Value: '95/100' }
    ],
    Metascore: '95',
    imdbRating: '8.9',
    imdbVotes: '2,200,000',
    imdbID: 'tt0110912',
    Type: 'movie'
  },
  {
    Title: 'Spirited Away',
    Year: '2001',
    Rated: 'PG',
    Released: '20 Jul 2001',
    Runtime: '125 min',
    Genre: 'Animation, Adventure, Family',
    Director: 'Hayao Miyazaki',
    Writer: 'Hayao Miyazaki',
    Actors: 'Daveigh Chase, Suzanne Pleshette, Jason Marsden',
    Plot: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    Language: 'Japanese',
    Country: 'Japan',
    Awards: 'Won 1 Oscar. 58 wins & 30 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.6/10' },
      { Source: 'Rotten Tomatoes', Value: '96%' },
      { Source: 'Metacritic', Value: '96/100' }
    ],
    Metascore: '96',
    imdbRating: '8.6',
    imdbVotes: '840,000',
    imdbID: 'tt0245429',
    Type: 'movie'
  },
  {
    Title: 'The Prestige',
    Year: '2006',
    Rated: 'PG-13',
    Released: '20 Oct 2006',
    Runtime: '130 min',
    Genre: 'Drama, Mystery, Sci-Fi',
    Director: 'Christopher Nolan',
    Writer: 'Jonathan Nolan, Christopher Nolan, Christopher Priest',
    Actors: 'Christian Bale, Hugh Jackman, Scarlett Johansson, Michael Caine',
    Plot: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
    Language: 'English',
    Country: 'United Kingdom, United States',
    Awards: 'Nominated for 2 Oscars. 6 wins & 36 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYjU3DQk1MjgtNDc2Ny00MWUxLWIxOTUtYWZiNTg2NTc5M2I5XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '77%' },
      { Source: 'Metacritic', Value: '66/100' }
    ],
    Metascore: '66',
    imdbRating: '8.5',
    imdbVotes: '1,400,000',
    imdbID: 'tt0482571',
    Type: 'movie'
  },
  {
    Title: 'Whiplash',
    Year: '2014',
    Rated: 'R',
    Released: '10 Oct 2014',
    Runtime: '106 min',
    Genre: 'Drama, Music',
    Director: 'Damien Chazelle',
    Writer: 'Damien Chazelle',
    Actors: 'Miles Teller, J.K. Simmons, Paul Reiser, Melissa Benoist',
    Plot: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Won 3 Oscars. 98 wins & 144 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BOTA5NDQ1NTEyM15BMl5BanBnXkFtZTgwOTE3MDE5MTE@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '94%' },
      { Source: 'Metacritic', Value: '89/100' }
    ],
    Metascore: '89',
    imdbRating: '8.5',
    imdbVotes: '980,000',
    imdbID: 'tt2582802',
    Type: 'movie'
  },
  {
    Title: 'Parasite',
    Year: '2019',
    Rated: 'R',
    Released: '30 May 2019',
    Runtime: '132 min',
    Genre: 'Drama, Thriller',
    Director: 'Bong Joon Ho',
    Writer: 'Bong Joon Ho, Han Jin Won',
    Actors: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik',
    Plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    Language: 'Korean, English',
    Country: 'South Korea',
    Awards: 'Won 4 Oscars. 312 wins & 270 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '99%' },
      { Source: 'Metacritic', Value: '97/100' }
    ],
    Metascore: '97',
    imdbRating: '8.5',
    imdbVotes: '930,000',
    imdbID: 'tt6751668',
    Type: 'movie'
  },
  {
    Title: 'The Godfather',
    Year: '1972',
    Rated: 'R',
    Released: '24 Mar 1972',
    Runtime: '175 min',
    Genre: 'Crime, Drama',
    Director: 'Francis Ford Coppola',
    Writer: 'Mario Puzo, Francis Ford Coppola',
    Actors: 'Marlon Brando, Al Pacino, James Caan, Diane Keaton',
    Plot: 'The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.',
    Language: 'English, Italian, Latin',
    Country: 'United States',
    Awards: 'Won 3 Oscars. 32 wins & 30 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYTJkNGQyYzUtZDQ0Yi00MDk0LWEwNDYtZjY4MTkyMTAwNGQ1XkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '9.2/10' },
      { Source: 'Rotten Tomatoes', Value: '97%' },
      { Source: 'Metacritic', Value: '100/100' }
    ],
    Metascore: '100',
    imdbRating: '9.2',
    imdbVotes: '2,010,000',
    imdbID: 'tt0068646',
    Type: 'movie'
  },
  {
    Title: 'Alien',
    Year: '1979',
    Rated: 'R',
    Released: '25 May 1979',
    Runtime: '117 min',
    Genre: 'Horror, Sci-Fi',
    Director: 'Ridley Scott',
    Writer: 'Dan O\'Bannon, Ronald Shusett',
    Actors: 'Sigourney Weaver, Tom Skerritt, John Hurt, Veronica Cartwright',
    Plot: 'The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission.',
    Language: 'English',
    Country: 'United Kingdom, United States',
    Awards: 'Won 1 Oscar. 18 wins & 22 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BOGJkM2FhMjQtYjMxMi00YjBhLTg2M2YtMzA5NDU2NTRlMDlhXkEyXkFqcGc@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '94%' },
      { Source: 'Metacritic', Value: '89/100' }
    ],
    Metascore: '89',
    imdbRating: '8.5',
    imdbVotes: '950,000',
    imdbID: 'tt0078748',
    Type: 'movie'
  }
];

// Helper to filter mock movies by query
const searchMockMovies = (query, page = 1) => {
  const lowercaseQuery = query.toLowerCase().trim();
  
  // If no query, return the entire database representing "Trending Now"
  let filtered = mockMovies;
  
  if (lowercaseQuery && lowercaseQuery !== 'space' && lowercaseQuery !== 'star' && lowercaseQuery !== 'trending') {
    filtered = mockMovies.filter(
      (m) =>
        m.Title.toLowerCase().includes(lowercaseQuery) ||
        m.Genre.toLowerCase().includes(lowercaseQuery) ||
        m.Director.toLowerCase().includes(lowercaseQuery) ||
        m.Actors.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  const limit = 10; // Match standard OMDb API page size
  const offset = (page - 1) * limit;
  const paginated = filtered.slice(offset, offset + limit);
  
  return {
    movies: paginated,
    totalResults: filtered.length,
    Response: 'True',
    isMock: true,
  };
};

// Fetch details for a specific movie (using cache, API, or mock fallback)
export async function fetchMovieDetails(imdbId) {
  const cacheKey = `movie_${imdbId}`;
  
  // 1. Check local cache
  const cached = getCache(cacheKey);
  if (cached) return cached;
  
  // 2. Try fetching from OMDb API
  try {
    const res = await fetch(`${BASE_URL}?i=${imdbId}&plot=full&apikey=${API_KEY}`);
    if (!res.ok) throw new Error('API server error');
    
    const data = await res.json();
    if (data.Response === 'True') {
      setCache(cacheKey, data);
      return data;
    }
  } catch (error) {
    console.warn(`OMDb API fetch error for ID ${imdbId}, falling back to mock database:`, error);
  }
  
  // 3. Fallback to mock data if API fails or rate-limits
  const mockMovie = mockMovies.find((m) => m.imdbID === imdbId);
  if (mockMovie) return mockMovie;

  // Scan cached search listings to reconstruct movie info if it was loaded during searches
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('omdb_cache_search_')) {
          const cached = JSON.parse(localStorage.getItem(key) || '{}');
          if (cached && cached.data && cached.data.movies) {
            const found = cached.data.movies.find((m) => m.imdbID === imdbId);
            if (found) {
              return {
                Title: found.Title || 'Unknown Movie',
                Year: found.Year || 'N/A',
                Rated: 'N/A',
                Released: 'N/A',
                Runtime: 'N/A',
                Genre: found.Genre || 'Movie',
                Director: 'Unknown Director',
                Writer: 'Unknown Writer',
                Actors: 'N/A',
                Plot: 'No overview is available because the OMDb API is currently rate-limited or offline. Add a valid API key to load full details.',
                Language: 'English',
                Country: 'N/A',
                Awards: 'N/A',
                Poster: found.Poster || 'N/A',
                Ratings: [],
                imdbRating: found.imdbRating || 'N/A',
                imdbID: found.imdbID,
                Type: found.Type || 'movie'
              };
            }
          }
        }
      }
    } catch (e) {
      console.error('Error scanning search cache:', e);
    }
  }

  // Final fallback placeholder
  return {
    Title: 'Movie Details',
    Year: 'N/A',
    Rated: 'N/A',
    Released: 'N/A',
    Runtime: 'N/A',
    Genre: 'Movie',
    Director: 'N/A',
    Writer: 'N/A',
    Actors: 'N/A',
    Plot: 'No overview is available because the OMDb API is currently rate-limited or offline.',
    Language: 'N/A',
    Country: 'N/A',
    Awards: 'N/A',
    Poster: 'N/A',
    Ratings: [],
    imdbRating: 'N/A',
    imdbID: imdbId,
    Type: 'movie'
  };
}

// Search movies (using cache, API + parallel detail pre-fetching, or mock fallback)
export async function searchMovies(query, page = 1) {
  const trimmedQuery = query.trim() || 'Star';
  const cacheKey = `search_${trimmedQuery.toLowerCase()}_${page}`;
  
  // 1. Check local cache
  const cached = getCache(cacheKey);
  if (cached) return cached;
  
  // 2. Try fetching search results from OMDb API
  try {
    const res = await fetch(
      `${BASE_URL}?s=${encodeURIComponent(trimmedQuery)}&page=${page}&apikey=${API_KEY}`
    );
    if (!res.ok) throw new Error('API server error');
    
    const data = await res.json();
    if (data.Response === 'True' && data.Search) {
      // OMDb search returns basic details. To display ratings and genres in our grid cards 
      // (which are required for the premium UI), we fetch details for each item in parallel.
      const detailedMovies = await Promise.all(
        data.Search.map(async (item) => {
          try {
            return await fetchMovieDetails(item.imdbID);
          } catch (e) {
            // If details fetch fails, return basic item
            return {
              ...item,
              Genre: 'N/A',
              imdbRating: 'N/A',
              Plot: 'No description available.',
            };
          }
        })
      );
      
      const result = {
        movies: detailedMovies,
        totalResults: parseInt(data.totalResults, 10),
        Response: 'True',
        isMock: false,
      };
      
      setCache(cacheKey, result);
      return result;
    } else if (data.Error) {
      // If OMDb says 'Too many results' or 'Movie not found', throw to use mock search fallback or show error
      throw new Error(data.Error);
    }
  } catch (error) {
    console.warn(`OMDb API search error for "${trimmedQuery}", falling back to mock database:`, error);
    // 3. Fallback: Search mock database
    return searchMockMovies(trimmedQuery, page);
  }
  
  // Fallback if data is empty/falsy
  return searchMockMovies(trimmedQuery, page);
}
