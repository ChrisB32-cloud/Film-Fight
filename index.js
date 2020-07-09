// api key: 37c59f27
const autocompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
  },

  inputValue(movie) {
    return movie.Title;
  },

  async fetchData(e) {
    const response = await axios.get('http://www.omdbapi.com', {
      params: {
        apikey: '37c59f27',
        s: e
      }
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  }
};

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summary, side) => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: '37c59f27',
      i: movie.imdbID
    }
  });

  summary.innerHTML = movieTemplete(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, idx) => {
    const rightStat = rightSideStats[idx];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplete = movieDetails => {
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metaScoreCheck = parseInt(movieDetails.Metascore);
  const imdbRatingCheck = parseFloat(movieDetails.imdbRating);
  const imdbVotesCheck = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

  const awardsCheck = movieDetails.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
  console.log(awardsCheck);

  // console.log(movieDetails);
  return `
  
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content"> 
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p?>
        </div>
      </div>
    </article
    <br>
    <article data-value=${awardsCheck} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScoreCheck} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRatingCheck} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotesCheck} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
// fetchData();
