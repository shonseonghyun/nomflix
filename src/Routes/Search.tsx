import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IGetMovieResult, searchMovie, searchSeries } from '../api/api';
import { makeImagePath } from '../utils';

const Wrapper= styled.div`
    margin-top: 80px;
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 80px;
    height: 100%;
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
    border-style: solid;
    border-width:1px;
    border-color: #ac8888;

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

const BigArea= styled(motion.div)`
    position: fixed;
    z-index: 99;
    top: 100px;
    left: 0px;
    right: 0px;
    margin: 0 auto;
    width: 50vw;
    height: 70vh;
    background-color: ${(props)=>props.theme.black.lighter};
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    opacity: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
`;

const BigCover = styled.div<{bgPhoto:string}>`
    /* position: absolute; */
    width: 100%;
    height: 55%;
    background-image: url(${props=>props.bgPhoto});
    background-size: cover;
    background-position: center center;
`;

const BigTitle = styled.div`
    color:${(props)=>props.theme.white.lighter};
    font-size: 20px;
    top:-60px;
    padding:20px;
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
        opacity:1,
        transition:{
            delay: 0.5
        }
    }
}

const Search = () => {
    const bigSearchMatch = useMatch("search/:category/:id");
    const navigate = useNavigate();
    const location= useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword") || "";
    const {data:movies,isLoading:moviesLoading} = useQuery<IGetMovieResult>(["movies",keyword],()=>searchMovie(keyword));
    const {data:series,isLoading:seriesLoading} = useQuery<IGetMovieResult>(["series",keyword],()=>searchSeries(keyword));
    
    const clickedItem = ()=>{
        if(bigSearchMatch?.params.id && bigSearchMatch.params.category){
            const category = bigSearchMatch.params.category;
            if(category ==="movie"){
                return movies?.results.find(movie => String(movie.id) === bigSearchMatch.params.id)
            }
            else if(category==="tv"){
                return series?.results.find(series => String(series.id) === bigSearchMatch.params.id)
            }
        }
    }

    const clickedSearchItem = clickedItem();    
    
    const onBoxClicked = (category:string, boxId:number)=>{
        navigate(`${category}/${boxId}?keyword=${keyword}`);
    }

    const onOverlayClicked=()=>{
        navigate(`/search?keyword=${keyword}`);
    }

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
                                    layoutId={movie.id+""}
                                    key={movie.id} 
                                    variants={movieVariants} 
                                    initial="normal" 
                                    whileHover="hover" 
                                    bgPhoto={movie.backdrop_path ? makeImagePath(movie.backdrop_path,"w500") : "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FzaHVf%2FbtsCUzDyFK6%2FzLwkbqViX9RYEST5DwRJmK%2Fimg.png" }
                                    onClick={()=>onBoxClicked("movie",movie.id)}
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
                    📺
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
                                    layoutId={series.id+""}
                                    key={series.id} 
                                    variants={movieVariants} 
                                    initial="normal" 
                                    whileHover="hover" 
                                    bgPhoto={series.backdrop_path ? makeImagePath(series.backdrop_path,"w500") : "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FzaHVf%2FbtsCUzDyFK6%2FzLwkbqViX9RYEST5DwRJmK%2Fimg.png" }
                                    onClick={()=>onBoxClicked("tv",series.id)}
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
            
            <AnimatePresence>
            {
                bigSearchMatch ?
                <>
                    <BigArea layoutId={bigSearchMatch.params.id}>
                        {
                            clickedSearchItem && 
                            <>
                                <BigCover 
                                    bgPhoto={clickedSearchItem.backdrop_path ? makeImagePath(clickedSearchItem.backdrop_path,"w500") : "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FzaHVf%2FbtsCUzDyFK6%2FzLwkbqViX9RYEST5DwRJmK%2Fimg.png" }
                                />
                                <BigTitle>
                                    {clickedSearchItem.title ? clickedSearchItem.title :clickedSearchItem.name }
                                </BigTitle>
                            </>
                        }
                    </BigArea>
                    
                    <Overlay onClick={onOverlayClicked}/>
                </>
                :
                null
            }
            </AnimatePresence>
        </Wrapper>
    );
};

export default Search;