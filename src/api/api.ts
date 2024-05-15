import axios from "axios";

const API_KEY="524aeda7436277d62d4dec0d998b8f5b";
const API= axios.create({
    baseURL:"https://api.themoviedb.org/3"
})

interface IMovie{
    id:number,
    backdrop_path:string,
    poster_path:string,
    title:string,
    overview:string,
    name:string
}

export interface IGetMovieResult{
    dates:{
        maximun:string,
        minimun:string
    },
    page:number,
    results: IMovie[],
    total_pages:number,
    total_results:number
}

export const getNowPlayingMovies = async ()=>{
    return await API.get(`/movie/now_playing?api_key=${API_KEY}`)
        .then(response=>response.data)
    ;
}

export const getPopularMovies = async ()=>{
    return await API.get(`/movie/popular?api_key=${API_KEY}`)
        .then(response=>response.data)
    ;
}
export const getUpcomingMovies = async ()=>{
    return await API.get(`/movie/upcoming?api_key=${API_KEY}`)
        .then(response=>response.data)
    ;
}

export const searchMovie = async (param:string)=>{
    return await API.get(`/search/movie?api_key=${API_KEY}&language=en-US&query=${param}`)
    .then(response=>response.data)
;
}

export const searchSeries = async (param:string)=>{
    return await API.get(`/search/tv?api_key=${API_KEY}&language=en-US&query=${param}`)
    .then(response=>response.data)
    ;
}