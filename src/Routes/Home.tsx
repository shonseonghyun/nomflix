import React from 'react';
import { useQuery } from 'react-query';
import { getMovies } from '../api/api';

const Home = () => {
    const {data,isLoading} = useQuery(["movies","nowPlaying"],
        getMovies
    );

    console.log(data,isLoading);

    return (
        <div style={{backgroundColor:"whitesmoke",height:"200vh"}}>
            <h1>home</h1>
        </div>        
    );
};

export default Home;