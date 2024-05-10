import React from 'react';
import { useQuery } from 'react-query';
import { IGetMovieResult, getMovies } from '../api/api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';

interface IBannerProps{
    bgPhoto:string,
}

const Wrapper = styled.div`
    background: black;
`;

const Loader = styled.div`
  height  :20vh ;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner  = styled.div<IBannerProps>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding:60px;
    background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.5)) 
        ,url(${props=>props.bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 48px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 24px;
    width:50%;
`;


const Home = () => {
    const {data,isLoading} = useQuery<IGetMovieResult>(["movies","nowPlaying"],
        getMovies
    );


    return (
        <Wrapper>
            {
                isLoading 
                ? 
                <Loader>
                    Loading...
                </Loader>
                :
                <>
                    <Banner 
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                </>
            }
        </Wrapper>        
    );
};

export default Home;