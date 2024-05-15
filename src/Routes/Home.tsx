import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { IGetMovieResult, getNowPlayingMovies, getPopularMovies, getUpcomingMovies } from '../api/api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import useWindowDimensions from '../useWindowDimensions';
import { useMatch, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCircleInfo, faPen, faPlay, faSmile, fas } from '@fortawesome/free-solid-svg-icons';
import Slider from '../Components/Slider';

export interface IBgPhotoProps{
    bgPhoto:string,
}

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
    overflow-y: hidden;
    /* background-color: yellow; */
`;

const Loader = styled.div`
  /* height :20vh ; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner  = styled.div<IBgPhotoProps>`
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
    margin-top: 150px;
    width:70%;
    font-size: 48px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    display:-webkit-box;
    font-size: 18px;
    width: 50%;
    white-space:normal;
    overflow:hidden;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    word-break: keep-all;
`;

const BtnWrapper = styled.div`
    margin-top: 20px;
`;

const PlayBtn = styled.button`
  background-color  : white;
  width: 80px;
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
  &:hover{
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const InfoBtn = styled.button`
  background-color  : rgba(75,75,75,0.8);
  color:rgb(255,252,255);
  width: 120px;
  height: 30px;
  border-radius: 5px;
  &:hover{
    background-color: rgba(127, 140, 141,1.0);
  }
`;

const BtnText =styled.p`
    display:inline-block;
    margin-left:5px;
    font-size:15px;
`;


const Overlay = styled(motion.div)`
    position: fixed;
    opacity: 0;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    /* display: flex;
    justify-content: center;
    align-items: center; */
`;

const BigMovie = styled(motion.div)`
    position:absolute;
    background-color: ${(props)=>props.theme.black.lighter};
    width:40vw;
    height:80vh;
    margin:0 auto;
    border-radius: 15px;
    overflow: hidden;
`;

const BigCover = styled.div`    
  width:100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle= styled.h3`
    color:${(props)=>props.theme.white.lighter};
    font-size: 30px;
    top:-60px;
    padding:20px;
    position: relative;
`;

const BigOverview =styled.p`
    position: relative;
    padding:20px;
    top:-60px;
    color:${(props)=>props.theme.white.lighter};
`;

const Home = () => {
    const bigMovieMatch = useMatch("movie/:category/:movieId");
    const navigate = useNavigate();
    const {data:nowPlaying,isLoading:nowPlayingLoading} = useQuery<IGetMovieResult>(["NowPlaing","nowPlaying"],getNowPlayingMovies,{refetchOnWindowFocus:false});
    const {data:popluar,isLoading:popularLoading} = useQuery<IGetMovieResult>(["Popular","popular"],getPopularMovies,{refetchOnWindowFocus:false});
    const {data:upcoming,isLoading:upcomingLoading} = useQuery<IGetMovieResult>(["upcoming","upcoming"],getUpcomingMovies,{refetchOnWindowFocus:false});
    const {scrollY}= useScroll();

    const newClicked = ()=>{
        if(bigMovieMatch?.params.movieId && bigMovieMatch.params.category){
            const category = bigMovieMatch.params.category;
            if(category ==="nowplaying"){
                return nowPlaying?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId)
            }
            else if(category==="popular"){
                return popluar?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId)
            }
            else{
                return upcoming?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId)
            }
        }
    }
    const clickedMovie = newClicked();
    console.log(clickedMovie);
    
    const onBokxClicked = (movieId:number)=>{
        navigate(`/movie/nowplaying/${movieId}`);
    }

    const onOverlayClicked = ()=>{
        navigate("/");
    }

    return (
        <Wrapper>
            {
                nowPlayingLoading 
                ? 
                <Loader>
                    Loading...
                </Loader>
                :
                <>
                    <Banner 
                        bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
                    >
                        <Title>{nowPlaying?.results[0].title}</Title>
                        <Overview>{nowPlaying?.results[0].overview}</Overview>
                        <BtnWrapper>
                            <PlayBtn>
                                <FontAwesomeIcon icon={faPlay} />
                                <BtnText>Play</BtnText>
                            </PlayBtn>
                            <InfoBtn>
                                <FontAwesomeIcon icon={faCircleInfo} />
                                <BtnText onClick={()=>onBokxClicked(nowPlaying?.results[0].id || 0)}>information</BtnText>
                            </InfoBtn>
                        </BtnWrapper>
                    </Banner>

                    <Slider movies={nowPlaying as IGetMovieResult} rowText='Now Playing'></Slider>
                    <Slider movies={popluar as IGetMovieResult} rowText='Popular'></Slider>
                    <Slider movies={upcoming as IGetMovieResult} rowText='Upcoming'></Slider>

                    <AnimatePresence>
                    {
                        bigMovieMatch ? 
                        <>
                            <Overlay onClick={onOverlayClicked} animate={{opacity:1}} exit={{opacity:0}}/>
                            <BigMovie layoutId={bigMovieMatch?.params.category+"/"+bigMovieMatch?.params.movieId} style={{top:scrollY.get()+100,left:0,right:90}}>
                                {
                                    clickedMovie &&
                                    <>
                                        <BigCover 
                                            style={{
                                                backgroundImage:`url(${makeImagePath(clickedMovie.backdrop_path)})`
                                            }} />
                                        <BigTitle>{clickedMovie.title}</BigTitle>
                                        <BigOverview>{clickedMovie.overview}</BigOverview>
                                    </>
                                }
                            </BigMovie>
                        </>
                        :null
                    }
                    </AnimatePresence>
                </>
            }
        </Wrapper>        
    );
};

export default Home;