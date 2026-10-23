# Top Series

A website with 21 TV series worth watching, ranked by rating. Built with plain HTML, CSS and JavaScript: no frameworks, no build step, no login.

## Features

- **Not sure what to watch tonight?** A TV at the top of the page shows a random series. Press **Change channel** to flip to another one. It only picks from series that match your current filters.
- **Search** by title or story
- **Filter by genre** (each genre shows how many series it has)
- **Sort** by top rated, title A–Z, newest or oldest
- **Favorites:** tap the heart on a poster to save it. Favorites are remembered in your browser, and the **Favorites** button shows only them.
- **Details window** with years, age rating, episode length, rating, description, trailer and an IMDb link. The YouTube trailer only loads when you press play, so the page stays fast.
- **Light and dark mode**, remembered in your browser
- Works on phones, tablets and desktops

## Run it

Open `index.html` in a browser. That's it.

## Put it online with GitHub Pages

1. Push the files to your GitHub repository.
2. On GitHub open **Settings → Pages**.
3. Under **Branch** choose `main` and `/ (root)`, then press **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

## Add a series

1. Put the poster in `images/` (WebP, about 480×720 px).
2. Copy an entry in `js/data.js` and change the details. The comment at the top of the file explains each field.

## Project structure

```
index.html      Page layout
css/style.css   All styles, light and dark theme
js/data.js      The list of series
js/app.js       Search, filters, sorting, favorites, details window, TV picker, theme switch
images/         Posters
icon.webp       Browser tab icon
```

Ratings are IMDb scores from when the list was made. Trailers are embedded from YouTube.
