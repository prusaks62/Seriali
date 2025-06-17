
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});


document.getElementById('genre-filter').addEventListener('change', function() {
  const selectedGenre = this.value; 
  const seriesList = document.querySelectorAll('article.series');

  seriesList.forEach(series => {const genre = series.getAttribute('data-genre');
    if (selectedGenre === 'all' || genre === selectedGenre) {
      series.style.display = ''; 
    } else {
      series.style.display = 'none'; 
    }
  });
});




