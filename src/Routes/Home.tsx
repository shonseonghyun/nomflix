import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { IGetMovieResult, getMovies } from '../api/api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import useWindowDimensions from '../useWindowDimensions';
import { useMatch, useNavigate } from 'react-router-dom';

interface IBgPhotoProps{
    bgPhoto:string,
}

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
  height :20vh ;
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
    font-size: 48px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 24px;
    width:50%;
`;

const Slider = styled.div`
    position: relative;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    top:-100px;
`;

const Box = styled(motion.div)<IBgPhotoProps>`
    background-color: white;
    height: 200px;
    color:white;
    font-size: 20px;
    background-image: url(${(props)=>props.bgPhoto});
    background-size: cover;
    background-position: center center;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    cursor: pointer;
    &:first-child{
        transform-origin:0% 100%;
    }
    &:last-child{
        transform-origin:100% 100%;
    }
`;
const Info = styled(motion.div)`
    width:100%;
    padding: 10px;
    background-color: ${props=>props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 15px;
    }
`;

const Overlay = styled(motion.div)`
    position: absolute;
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


const infoVariants = {
    hover:{
        opacity:1,
        transition:{
            delay:0.5,
            type:"tween"
        }
    }
}

// const rowVariants = {
//     hidden:{
//         // x: window.outerWidth -(window.outerWidth/5)
//         x: width +10
//     },
//     visible:{
//         x:0
//     },
//     exit:{
//         x: -window.outerWidth +(window.outerWidth/5)
//     }
// }

const boxVariants ={
    normal : {
        scale: 1
    } ,
    hover:{
        scale:1.2,
        y:-30,
        transition:{
            delay:0.5,
            type:"tween"
        }
    }
}

const Home = () => {
    const offset = 6;
    const bigMovieMatch = useMatch("movie/:movieId");
    const width =  useWindowDimensions();
    const navigate = useNavigate();
    const {data,isLoading} = useQuery<IGetMovieResult>(["movies","nowPlaying"],getMovies,{refetchOnWindowFocus:false});
    const [page,setPage] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const {scrollY}= useScroll();
    //click한 movie 상세 정보
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId)
    console.log(clickedMovie);
    
    const increaseIndex = ()=>{
        if(data){
            if(leaving) return;
            setLeaving(true);
            const totalMovies = data?.results.length-1;
            const maxIndex = Math.ceil(totalMovies / offset) -1;
            setPage((prev)=>prev === maxIndex ? 0 : prev+1);
        }
    };

    const onBokxClicked = (movieId:number)=>{
        navigate(`/movie/${movieId}`);
    }

    const onOverlayClicked = ()=>{
        navigate("/");
    }

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
                        onClick={increaseIndex}
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence 
                            initial={false} //slider 제자리 유지, AnimatePresence는 컴포넌트가 처음 렌더링될 때 자식의 초기 애니메이션을 비활성화합니다.
                            onExitComplete={()=>setLeaving(false)} //exit 중인 모든 노드들이 애니메이션을 끝내면 실행됩니다.
                         >
                            <Row 
                                key={page} 
                                // variants={rowVariants} 
                                // initial="hidden" 
                                // animate="visible" 
                                // exit="exit" 
                                initial={{ x: width + 10 }}
                                animate={{ x: 0 }}
                                exit={{ x: -width - 10 }}
                                transition={{type:"tween",duration:1}}
                            >
                                {
                                    data?.results.slice(1).slice(offset*page, offset*page+offset).map((movie)=>(
                                        <Box 
                                            layoutId={movie.id+""}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            // whileHover={{scale:1.3}}
                                            // initial={{scale:1}}
                                            transition={{type:'tween'}}
                                            key={movie.id}
                                            bgPhoto={makeImagePath(movie.backdrop_path)}
                                            onClick={()=>onBokxClicked(movie.id)}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))
                                }
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                    {
                        bigMovieMatch ? 
                        <>
                            <Overlay onClick={onOverlayClicked} animate={{opacity:1}} exit={{opacity:0}}/>
                            <BigMovie layoutId={bigMovieMatch?.params.movieId} style={{top:scrollY.get()+100,left:0,right:90}}>
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