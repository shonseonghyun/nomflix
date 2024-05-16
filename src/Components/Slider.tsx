import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IBgPhotoProps } from '../Routes/Home';
import { IGetMovieResult } from '../api/api';
import useWindowDimensions from '../useWindowDimensions';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
position: relative;
margin-left: 30px;
/* top: -500px;  */
margin-bottom: 80px;
height: 200px;
`;

interface IRowProps{
    page:number
}

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

const RowName = styled.h1`
    position: absolute;
    top:-30px;
    width   :100% ;
    height: 200px;
    font-size: 20px;
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

const infoVariants = {
    hover:{
        opacity:1,
        transition:{
            delay:0.5,
            type:"tween"
        }
    }
}

interface ISliderProps{
    movies:IGetMovieResult,
    rowText: string
}


const Slider = ({movies,rowText}:ISliderProps) => {
    const rowName = rowText.toLowerCase().replaceAll(" ","");
    const offset = 6;
    const navigate = useNavigate();
    const width =  useWindowDimensions();
    const [page,setPage] = useState(0);
    const [leaving,setLeaving] = useState(false);
    const [back,setBack] = useState(false);

    const increaseIndex = ()=>{
        if(movies){
            if(leaving) return;
            setLeaving(true);
            setBack(false);
            const totalMovies = movies?.results.length-1;
            const maxIndex = Math.ceil(totalMovies / offset) -1;
            setPage((prev)=>prev === maxIndex ? 0 : prev+1);
        }
    };

    const decreaseIndex = ()=>{
        if(movies){
            if(leaving) return;
            setLeaving(true);
            setBack(true);
            const totalMovies = movies?.results.length-1;
            const maxIndex = Math.ceil(totalMovies / offset) -1;
            setPage((prev)=>prev === 0 ? maxIndex : prev-1);
        }
    };

    const onBokxClicked = (movieId:number)=>{
        navigate(`/movie/${rowName}/${movieId}`);
    }

    return (
        <Wrapper>
            <RowName>{rowName}</RowName>
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
                        movies?.results.slice(1).slice(offset*page, offset*page+offset).map((movie)=>(
                            <Box 
                                layoutId={rowName+"/"+movie.id}
                                variants={boxVariants}
                                initial="normal"
                                whileHover="hover"
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
        </Wrapper>
    );
};

export default Slider;