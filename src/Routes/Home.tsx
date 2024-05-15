import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { IGetMovieResult, getMovies } from '../api/api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import useWindowDimensions from '../useWindowDimensions';
import { useMatch, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCircleInfo, faPen, faPlay, faSmile, fas } from '@fortawesome/free-solid-svg-icons';

interface IBgPhotoProps{
    bgPhoto:string,
}

interface IRowProps{
    page:number
}

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
    /* overflow-y: hidden; */
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

const Slider = styled.div`
    position: relative;
    margin-left: 30px;
    /* top: -500px;  */
    margin-bottom: 80px;
    height: 200px;
`;

const LeftArrow = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    top:0px;
    background-color: rgba(0,0,0,0.5);
    left: 0px;
    width: 20px;
    height: 200px;
    position: absolute;
`;

const RightArrow = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    top:0px;
    background-color: rgba(0,0,0,0.5);
    right: 0px;
    width: 20px;
    height: 200px;
    position: absolute;
`;
const RowName = styled.h1`
    position: absolute;
    top:-30px;
    width   :100% ;
    height: 200px;
    font-size: 20px;
`;

const Row = styled(motion.div)<IRowProps>`
    position: absolute;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    width: 100%;
    /* &:hover >  ${LeftArrow},${RightArrow}{
        opacity: 1;
    } */
    & > .hover_arrow{
            opacity: 0;
            cursor: pointer;
    }
    &:hover > .hover_arrow{
            opacity: 1;
            transition: opacity 0.2s ease-in-out;
    }
    /* & >  .hover_arrow:{
        background-color: yellow;
    } */
`;

const Box = styled(motion.div)<IBgPhotoProps>`
    background-color: white;
    height: 200px;
    border-radius: 10px;
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
    const [back,setBack] = useState(false);
    const {scrollY}= useScroll();
    //click한 movie 상세 정보
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => String(movie.id) === bigMovieMatch.params.movieId)
    
    const increaseIndex = ()=>{
        if(data){
            if(leaving) return;
            setLeaving(true);
            setBack(false);
            const totalMovies = data?.results.length-1;
            const maxIndex = Math.ceil(totalMovies / offset) -1;
            setPage((prev)=>prev === maxIndex ? 0 : prev+1);
        }
    };

    const decreaseIndex = ()=>{
        if(data){
            if(leaving) return;
            setLeaving(true);
            setBack(true);
            const totalMovies = data?.results.length-1;
            const maxIndex = Math.ceil(totalMovies / offset) -1;
            setPage((prev)=>prev === 0 ? maxIndex : prev-1);
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
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                        <BtnWrapper>
                            <PlayBtn>
                                <FontAwesomeIcon icon={faPlay} />
                                <BtnText>Play</BtnText>
                            </PlayBtn>
                            <InfoBtn>
                                <FontAwesomeIcon icon={faCircleInfo} />
                                <BtnText onClick={()=>onBokxClicked(data?.results[0].id || 0)}>information</BtnText>
                            </InfoBtn>
                        </BtnWrapper>
                    </Banner>

                    <Slider>
                        <RowName>Now Playing</RowName>
                        <AnimatePresence 
                            custom={back}
                            initial={false} //slider 제자리 유지, AnimatePresence는 컴포넌트가 처음 렌더링될 때 자식의 초기 애니메이션을 비활성화합니다.
                            onExitComplete={()=>setLeaving(false)} //exit 중인 모든 노드들이 애니메이션을 끝내면 실행됩니다.
                         > 
                            <Row 
                                page={page}
                                className='row'
                                key={page} 
                                custom={back}
                                initial={{ x: back? -width-10  : width + 10 }}
                                animate={{ x: 0 }}
                                exit={{ x: back? width+10: -width-10 }}
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
                                <>
                                    <LeftArrow className='hover_arrow' onClick={decreaseIndex}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </LeftArrow>    
                                    <RightArrow className='hover_arrow' onClick={increaseIndex}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </RightArrow>    
                                </>
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    <Slider>
                        <RowName>Best Playing</RowName>
                        <AnimatePresence 
                            custom={back}
                            initial={false} //slider 제자리 유지, AnimatePresence는 컴포넌트가 처음 렌더링될 때 자식의 초기 애니메이션을 비활성화합니다.
                            onExitComplete={()=>setLeaving(false)} //exit 중인 모든 노드들이 애니메이션을 끝내면 실행됩니다.
                         >
                            <Row 
                                page={page}
                                className='row'
                                key={page} 
                                custom={back}
                                initial={{ x: back? -width-10  : width + 10 }}
                                animate={{ x: 0 }}
                                exit={{ x: back? width+10: -width-10 }}
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
                                <>
                                    <LeftArrow className='hover_arrow' onClick={decreaseIndex}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </LeftArrow>    
                                    <RightArrow className='hover_arrow' onClick={increaseIndex}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </RightArrow>    
                                </>
                            </Row>
                        </AnimatePresence>
                    </Slider>

                    <Slider>
                        <RowName>comming Soon</RowName>
                        <AnimatePresence 
                            custom={back}
                            initial={false} //slider 제자리 유지, AnimatePresence는 컴포넌트가 처음 렌더링될 때 자식의 초기 애니메이션을 비활성화합니다.
                            onExitComplete={()=>setLeaving(false)} //exit 중인 모든 노드들이 애니메이션을 끝내면 실행됩니다.
                         >
                            <Row 
                                page={page}
                                className='row'
                                key={page} 
                                custom={back}
                                initial={{ x: back? -width-10  : width + 10 }}
                                animate={{ x: 0 }}
                                exit={{ x: back? width+10: -width-10 }}
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
                                <>
                                    <LeftArrow className='hover_arrow' onClick={decreaseIndex}>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </LeftArrow>    
                                    <RightArrow className='hover_arrow' onClick={increaseIndex}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </RightArrow>    
                                </>
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