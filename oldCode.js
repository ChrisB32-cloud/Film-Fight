// old code base before refactoring

const root = document.querySelector('.autocomplete');
// const target = document.querySelector('#target');

root.innerHTML = `
<label><b>Search For a Movie</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');
const summary = document.querySelector('#summary');

const fetchData = async e => {
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
};

const onInput = async e => {
  const movies = await fetchData(e.target.value);

  if (!movies.length) {
    dropdown.classList.remove('is-active');
    return;
  }

  resultsWrapper.innerHTML = '';
  dropdown.classList.add('is-active');
  movies.forEach(movie => {
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.classList.add('dropdown-item');
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movie.Title}
    `;
    option.addEventListener('click', () => {
      dropdown.classList.remove('is-active');
      input.value = movie.Title;

      onMovieSelect(movie);
    });
    resultsWrapper.append(option);
  });
};

input.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click', e => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
});

const onMovieSelect = async movie => {
  const response = await axios.get('http://www.omdbapi.com', {
    params: {
      apikey: '37c59f27',
      i: movie.imdbID
    }
  });
  summary.innerHTML = movieTemplete(response.data);
};

const movieTemplete = movieDetails => {
  console.log(movieDetails);
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
    <article class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
// fetchData();
