// Uses "catalog.json" as a data source
// Requires The Movie Database token
// New entry === no "poster_path" property (string)
// Television === "television" property (boolean)

import { finished } from 'stream/promises';
import { Readable } from 'stream';
import { createWriteStream, existsSync, readFileSync, writeFileSync } from 'fs';

let TOKEN = null;

const data = readFileSync( 'catalog.json', 'utf8' );
const catalog = JSON.parse( data );

function delay( time = 5000 ) {
  return new Promise( resolve => setTimeout( resolve, time ) );
}

async function downloadPoster( path, file ) {
  const stream = createWriteStream( file );
  const { body } = await fetch( `https://image.tmdb.org/t/p/w300${path}` );
  await finished( Readable.fromWeb( body ).pipe( stream ) );
}

async function loadMovie( title, year ) {
  const params = new URLSearchParams();
  params.append( 'query', title );
  params.append( 'year', year );

  const query = params.toString();

  return fetch( `https://api.themoviedb.org/3/search/movie?${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json'
    }
  } )
  .then( ( response ) => response.json() )
  .then( ( db ) => {
    console.log( db.results[0] );
    db.results[0].genre_names = db.results[0].genre_ids.map( ( id ) => {
      return movie_genres.find( ( genre ) => genre.id === id ? true : false ).name;
    } );
    return structuredClone( db.results[0] );
  } );
}

async function loadMovieGenres() {
  return fetch( 'https://api.themoviedb.org/3/genre/movie/list', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json'    
    }
  } )
  .then( ( response ) => response.json() )
  .then( ( data ) => data.genres );
}

async function loadShow( title, year ) {
  const params = new URLSearchParams();
  params.append( 'query', title );
  params.append( 'year', year );

  const query = params.toString();

  return fetch( `https://api.themoviedb.org/3/search/tv?${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json'
    }
  } )
  .then( ( response ) => response.json() )
  .then( ( db ) => {
    db.results[0].genre_names = db.results[0].genre_ids.map( ( id ) => {
      return show_genres.find( ( genre ) => genre.id === id ? true : false ).name;
    } );
    return structuredClone( db.results[0] );
  } );
}

async function loadShowGenres() {
  return fetch( 'https://api.themoviedb.org/3/genre/tv/list', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json'    
    }
  } )
  .then( ( response ) => response.json() )
  .then( ( data ) => data.genres );
}

let movie_genres = null;
let show_genres = null;

async function main() {
  await process.loadEnvFile( '.env' );
  TOKEN = process.env.THE_MOVIE_DATABASE;

  movie_genres = await loadMovieGenres();
  show_genres = await loadShowGenres();  

  for( let m = 0; m < catalog.length; m++ ) {
    const current = catalog[m].hasOwnProperty( 'poster_path' );
    const tv = catalog[m].hasOwnProperty( 'television' );    
    console.log( ( m + 1 ) + ': ' + catalog[m].title + ' ' + ( current ? '✅' : '❌' ) );    

    if( !current ) {
      if( tv ) {
        const show = await loadShow( catalog[m].title, catalog[m].year );
        show.title = show.name;
        show.release_date = show.first_air_date;
        catalog[m] = show;
      } else {
        catalog[m] = await loadMovie( catalog[m].title, catalog[m].year );
      }

      writeFileSync( 'catalog.json', JSON.stringify( catalog ) );      

      const path = catalog[m].poster_path.substring( 1 );
      if( !existsSync( path ) ) {
        await downloadPoster( catalog[m].poster_path, path, tv );
      }

      await delay();
    }
  }
}

main();
