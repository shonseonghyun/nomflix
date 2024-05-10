import axios from "axios";

const API_KEY="524aeda7436277d62d4dec0d998b8f5b";
const API= axios.create({
    baseURL:"https://api.themoviedb.org/3"
})

 export const getMovies = async ()=>{
    return await API.get(`/movie/now_playing?api_key=${API_KEY}`)
        .then(response=>response.data)
    ;
}