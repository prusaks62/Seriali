// Top Series: catalog filters, favorites, the details window, the
// "change channel" picker and the light/dark switch. The series list is in data.js.

const GENRES = {
    all: 'All', drama: 'Drama', crime: 'Crime', 'sci-fi': 'Sci-fi & fantasy',
    thriller: 'Thriller', comedy: 'Comedy', animation: 'Animation', action: 'Action',
};

// How each sort option orders two series
const SORTS = {
    rating: (a, b) => b.rating - a.rating || a.title.localeCompare(b.title),
    title: (a, b) => a.title.localeCompare(b.title),
    newest: (a, b) => b.start - a.start || b.rating - a.rating,
    oldest: (a, b) => a.start - b.start || b.rating - a.rating,
};

// Place on the list by rating; also used as the TV channel number
const rankOf = new Map([...SERIES].sort(SORTS.rating).map((series, i) => [series.id, i + 1]));

const state = { genre: 'all', search: '', sort: 'rating', favoritesOnly: false };
const favorites = new Set(load('favorites', []));
let currentPick = null;

const $ = (id) => document.getElementById(id);

const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.9 3.6 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z"/></svg>';

/* ---------- Small helpers ---------- */

// localStorage can be blocked (e.g. private mode), so it must never crash the page
function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}

function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* not saved, page still works */ }
}

// Makes text safe to put inside HTML
function esc(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function years(series) {
    if (series.end === series.start) return String(series.start);
    return `${series.start}–${series.end ?? 'present'}`;
}

function findSeries(id) {
    return SERIES.find((series) => series.id === id);
}

// Poster with the title as backup text in case the image file is missing
function posterHtml(series, extraClass = '', extra = '') {
    return `<div class="poster ${extraClass}" data-title="${esc(series.title)}">
        <img src="${esc(series.image)}" alt="" loading="lazy">${extra}</div>`;
}

// When a poster image fails to load, show the title instead (see .poster.missing in the CSS)
document.addEventListener('error', (event) => {
    const poster = event.target.parentElement;
    if (event.target.tagName === 'IMG' && poster && poster.classList.contains('poster')) poster.classList.add('missing');
}, true);

/* ---------- Catalog ---------- */

// Series that match the current search, genre and favorites filter, in the chosen order
function visibleSeries() {
    const query = state.search.trim().toLowerCase();
    return SERIES
        .filter((series) => state.genre === 'all' || series.genre === state.genre)
        .filter((series) => !state.favoritesOnly || favorites.has(series.id))
        .filter((series) => !query
            || series.title.toLowerCase().includes(query)
            || series.description.toLowerCase().includes(query))
        .sort(SORTS[state.sort]);
}

function favButtonHtml(series) {
    const on = favorites.has(series.id);
    const label = on ? `Remove ${series.title} from favorites` : `Add ${series.title} to favorites`;
    return `<button class="fav" type="button" data-fav="${series.id}" aria-pressed="${on}" aria-label="${esc(label)}">${HEART}</button>`;
}

function cardHtml(series) {
    return `<li class="card">
        ${posterHtml(series, '', `<span class="rank">#${rankOf.get(series.id)}</span>`)}
        <h3><button class="card-open" type="button" data-open="${series.id}">${esc(series.title)}</button></h3>
        <p class="card-meta"><span class="stars">★ ${series.rating.toFixed(1)}</span><span>${GENRES[series.genre]}</span></p>
        ${favButtonHtml(series)}
    </li>`;
}

function renderGrid() {
    const list = visibleSeries();
    $('grid').innerHTML = list.map(cardHtml).join('');
    $('result-count').textContent = list.length === SERIES.length
        ? `${list.length} series`
        : `${list.length} of ${SERIES.length} series`;

    $('empty').hidden = list.length > 0;
    if (!list.length) {
        $('empty-text').textContent = state.favoritesOnly && favorites.size === 0
            ? 'You have no favorites yet. Tap the heart on a poster to save it here.'
            : 'No series match your filters.';
    }
}

// Genre buttons, with how many series each genre has
function renderGenres() {
    $('genres').innerHTML = Object.entries(GENRES).map(([value, label]) => {
        const count = value === 'all' ? SERIES.length : SERIES.filter((series) => series.genre === value).length;
        return `<button class="chip" type="button" data-genre="${value}" aria-pressed="${value === state.genre}">
            ${label} <span class="chip-count">${count}</span></button>`;
    }).join('');
}

function setGenre(genre) {
    state.genre = genre;
    document.querySelectorAll('[data-genre]').forEach((chip) => {
        chip.setAttribute('aria-pressed', chip.dataset.genre === genre);
    });
    renderGrid();
}

function clearFilters() {
    state.search = '';
    state.favoritesOnly = false;
    $('search').value = '';
    $('fav-filter').setAttribute('aria-pressed', 'false');
    setGenre('all');
}

/* ---------- Favorites ---------- */

function toggleFavorite(id) {
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    save('favorites', [...favorites]);
    $('fav-count').textContent = favorites.size;

    const series = findSeries(id);
    const on = favorites.has(id);
    // Update the heart buttons in place so keyboard focus stays where it was
    document.querySelectorAll(`[data-fav="${id}"]`).forEach((button) => {
        button.setAttribute('aria-pressed', on);
        button.setAttribute('aria-label', on ? `Remove ${series.title} from favorites` : `Add ${series.title} to favorites`);
    });
    document.querySelectorAll(`[data-fav-detail="${id}"]`).forEach((button) => {
        button.setAttribute('aria-pressed', on);
        button.lastElementChild.textContent = on ? 'In your favorites' : 'Add to favorites';
    });
    if (state.favoritesOnly) renderGrid();
}

/* ---------- Details window ---------- */

function openDetails(id) {
    const series = findSeries(id);
    const on = favorites.has(id);
    const dialog = $('details');

    dialog.innerHTML = `<div class="details-inner">
        <button class="icon-btn close" type="button" data-close aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        ${posterHtml(series, 'details-poster')}
        <div class="details-body">
            <h2 id="details-title">${esc(series.title)}</h2>
            <ul class="facts">
                <li>${years(series)}</li><li>${esc(series.age)}</li><li>${esc(series.runtime)}</li><li>${GENRES[series.genre]}</li>
            </ul>
            <p class="score"><strong>★ ${series.rating.toFixed(1)}</strong><span>out of 10, #${rankOf.get(id)} on this list</span></p>
            <p class="description">${esc(series.description)}</p>
            <div class="trailer" id="trailer">
                <!-- The YouTube player only loads when you press play, which keeps the page fast -->
                <button type="button" data-play="${esc(series.trailer)}" aria-label="Play the ${esc(series.title)} trailer">
                    <img src="https://i.ytimg.com/vi/${esc(series.trailer)}/hqdefault.jpg" alt="" loading="lazy">
                    <span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>Play trailer</span>
                </button>
            </div>
            <div class="actions">
                <button class="btn btn-primary fav-detail" type="button" data-fav-detail="${id}" aria-pressed="${on}">
                    ${HEART}<span>${on ? 'In your favorites' : 'Add to favorites'}</span>
                </button>
                <a class="btn btn-ghost" href="https://www.imdb.com/title/${esc(series.imdb)}/" target="_blank" rel="noopener">Open on IMDb</a>
            </div>
        </div>
    </div>`;
    dialog.showModal();
}

// Emptying the window also stops a trailer that is playing
function closeDetails() {
    $('details').close();
    $('details').innerHTML = '';
}

/* ---------- "Change channel" picker ---------- */

const tvScreen = $('tv-screen');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showPick(series) {
    currentPick = series;
    tvScreen.classList.remove('no-signal');

    const poster = $('tv-poster');
    poster.classList.remove('missing');
    poster.dataset.title = series.title;
    poster.querySelector('img').src = series.image;
    // Full address, because a url() inside the CSS file would be read relative to the css/ folder
    tvScreen.style.setProperty('--poster', `url("${new URL(series.image, document.baseURI).href}")`);

    $('tv-channel').textContent = `CH ${rankOf.get(series.id)}`;
    $('pick-title').textContent = series.title;
    $('pick-meta').innerHTML = `<span class="stars">★ ${series.rating.toFixed(1)}</span>
        <span>${GENRES[series.genre]}</span><span>${years(series)}</span><span>${esc(series.runtime)}</span>`;
    $('pick-text').textContent = series.description;
    $('pick-details').disabled = false;
}

function showNoSignal() {
    currentPick = null;
    tvScreen.classList.add('no-signal');
    $('tv-channel').textContent = '';
    $('pick-title').textContent = 'No signal';
    $('pick-meta').textContent = '';
    $('pick-text').textContent = 'No series match your filters, so there is nothing to show. Clear the filters to get more channels.';
    $('pick-details').disabled = true;
}

// Picks a random series from the ones that match the filters (never the same one twice in a row)
function changeChannel() {
    const list = visibleSeries();
    if (!list.length) return showNoSignal();
    const choices = list.length > 1 ? list.filter((series) => series !== currentPick) : list;
    const next = choices[Math.floor(Math.random() * choices.length)];

    if (reduceMotion.matches) return showPick(next);
    // Short burst of TV static, with the new poster appearing in the middle of it
    tvScreen.classList.remove('switching');
    void tvScreen.offsetWidth;   // restarts the CSS animation
    tvScreen.classList.add('switching');
    setTimeout(() => showPick(next), 200);
}

/* ---------- Light / dark mode ---------- */

function updateThemeButton() {
    const dark = document.documentElement.dataset.theme !== 'light';
    $('theme-toggle').setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* choice just isn't remembered */ }
    updateThemeButton();
}

/* ---------- Events ---------- */

$('search').addEventListener('input', (event) => { state.search = event.target.value; renderGrid(); });
$('sort').addEventListener('change', (event) => { state.sort = event.target.value; renderGrid(); });
$('genres').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-genre]');
    if (chip) setGenre(chip.dataset.genre);
});
$('fav-filter').addEventListener('click', () => {
    state.favoritesOnly = !state.favoritesOnly;
    $('fav-filter').setAttribute('aria-pressed', state.favoritesOnly);
    renderGrid();
});
$('clear-filters').addEventListener('click', clearFilters);

$('grid').addEventListener('click', (event) => {
    const fav = event.target.closest('[data-fav]');
    if (fav) return toggleFavorite(fav.dataset.fav);
    const open = event.target.closest('[data-open]');
    if (open) openDetails(open.dataset.open);
});

$('details').addEventListener('click', (event) => {
    const dialog = $('details');
    // Clicking the dark area around the window or the X closes it
    if (event.target === dialog || event.target.closest('[data-close]')) return closeDetails();

    const play = event.target.closest('[data-play]');
    if (play) {
        $('trailer').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.play}?autoplay=1"
            title="Trailer" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    }
    const fav = event.target.closest('[data-fav-detail]');
    if (fav) toggleFavorite(fav.dataset.favDetail);
});
// The Esc key closes the window by itself; empty it then too.
// (The close event can arrive late, so check the window wasn't opened again meanwhile.)
$('details').addEventListener('close', () => {
    if (!$('details').open) $('details').innerHTML = '';
});

$('change-channel').addEventListener('click', changeChannel);
$('pick-details').addEventListener('click', () => { if (currentPick) openDetails(currentPick.id); });
$('theme-toggle').addEventListener('click', toggleTheme);

/* ---------- Start ---------- */

$('year').textContent = new Date().getFullYear();
$('fav-count').textContent = favorites.size;
updateThemeButton();
renderGenres();
renderGrid();
showPick(SERIES[Math.floor(Math.random() * SERIES.length)]);
