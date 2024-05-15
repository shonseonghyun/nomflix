import React from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { IGetMovieResult, searchMovie, searchSeries } from '../api/api';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faVideo } from '@fortawesome/free-solid-svg-icons';
import { makeImagePath } from '../utils';
import { motion } from 'framer-motion';

const Wrapper= styled.div`
    margin-top: 80px;
    margin-left: 30px;
    margin-right: 30px;
`;

const SearchingWrapper =styled.div`
`;

const CommonText =styled.p`
    display: inline-block;
    margin-top:40px;
    font-size: 20px;
    color:${(props)=>props.theme.white.darker};
    h1{
        font-size: 18px;
    }
`;

const SearchedWrapper =styled.div`
    margin-top: 30px;
`;

const Title = styled.p`
    font-size: 24px;
    margin-bottom: 10px;
`;

const Grid = styled.div`
    width:100%;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    gap: 10px;
`; 

const Movie = styled(motion.div)<{bgPhoto:string}>`
    position: relative;
    height: 150px;
    background-image: url(${props=>props.bgPhoto});
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    &:nth-child(6n+1){
        transform-origin:0% 100%;
    }

    &:nth-child(6n+6){
        transform-origin:100% 100%;
    }
    &:hover{
        z-index: 99;
    }
`;

const TitleOverlay = styled(motion.div)`
    position: absolute;
    width: 100%;
    padding: 10px;
    background-color: ${props=>props.theme.black.lighter};
    bottom: 0;
    h4{
        text-align: center;
        font-size: 15px;
    }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const movieVariants = {
    normal:{
        scale:1
    },
    hover:{
        scale:1.2,
        y:-30,
        transition:{
            delay:0.5,
            type:"tween"
        }
    }
}

const titleoverlayVariants = {
    normal:{
        opacity:0
    },
    hover:{
        opacity:1
    }
}

const Search = () => {
    const location= useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword") || "";
    const {data:movies,isLoading:moviesLoading} = useQuery<IGetMovieResult>(["movies",keyword],()=>searchMovie(keyword));
    const {data:series,isLoading:seriesLoading} = useQuery<IGetMovieResult>(["series",keyword],()=>searchSeries(keyword));
    
    return (
        <Wrapper>
            <SearchingWrapper>
                {
                    keyword ?
                    <CommonText>
                        Result of searching with&nbsp;
                        <h1 style={{display:"inline-block"}}>
                            {keyword}
                        </h1>
                    </CommonText>
                    : <CommonText>
                        No search results found.
                        Click the magnifying glass icon in the upper right to search!
                    </CommonText>
                }
            </SearchingWrapper>

            <SearchedWrapper>
                <Title>
                    📽️
                    Movie
                </Title>
                <Grid>
                    {
                        moviesLoading 
                        ?
                        <Loader>
                            Loading...
                        </Loader> 
                        :
                        <>
                            {movies?.results.map(movie=>(
                                <Movie 
                                    key={movie.id} 
                                    variants={movieVariants} 
                                    initial="normal" 
                                    whileHover="hover" 
                                    bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path,"w500") : "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FzaHVf%2FbtsCUzDyFK6%2FzLwkbqViX9RYEST5DwRJmK%2Fimg.png" }
                                >
                                    <TitleOverlay variants={titleoverlayVariants}>
                                        {movie.title}    
                                    </TitleOverlay>
                                </Movie>
                            ))}
                        </>

                    }
                </Grid>
            </SearchedWrapper>

            <SearchedWrapper>
                <Title>
                    <FontAwesomeIcon style={{marginRight:"5px"}} icon={faTv} />
                    Series
                </Title>
                <Grid>
                    {
                        seriesLoading 
                        ?
                        <Loader>
                            Loading...
                        </Loader> 
                        :
                        <>
                            {series?.results.map(series=>(
                                <Movie 
                                    key={series.id} 
                                    variants={movieVariants} 
                                    initial="normal" 
                                    whileHover="hover" 
                                    bgPhoto={series.backdrop_path ? makeImagePath(series.backdrop_path,"w500") : "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FzaHVf%2FbtsCUzDyFK6%2FzLwkbqViX9RYEST5DwRJmK%2Fimg.png" }
                                >
                                    <TitleOverlay variants={titleoverlayVariants}>
                                        {series.name}    
                                    </TitleOverlay>
                                </Movie>                            
                            ))}
                        </>

                    }
                </Grid>
            </SearchedWrapper>
        </Wrapper>
    );
};

export default Search;