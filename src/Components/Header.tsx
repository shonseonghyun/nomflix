import { motion, useAnimation, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface IForm{
    keyword:string
}

const Nav = styled(motion.nav)`
    display: flex;
    justify-content: space-between; //box 간에만 공백을 주고 양 끝은 공백없이 배치
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    height: 80px;
    font-size: 14px;
    padding: 20px 60px;
    color: white;
    z-index: 99;
`;

const Col = styled(motion.div)`
    display: flex;
    align-items: center;
`;

const Logo = styled(motion.svg)`
    margin-right: 50px;
    width:95px;
    height: 25px;
    fill:${(props)=>props.theme.red};
    path {
        stroke-width: 5px;
        stroke: white;
    }
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
    transform-origin: right center; //transformation의 원점을 설정
    position: absolute;
    left: -170px;
    background-color: gray;
    color:whitesmoke;
    &::placeholder {
        color: white;
    }
`;

const Items = styled.ul`
    display: flex;
    align-items: center;
`;

const Circle = styled(motion.span)`
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: ${(props)=>props.theme.red};
    border-radius: 5px;
    bottom: -10px;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

const Item= styled.li`
    margin-right: 20px;
    color:${(props)=>props.theme.white.darker};
    /* transition: color 5 ease-in-out; */
    position: relative;
    display:flex;
    font-size:14px;
    justify-content: center;
    flex-direction: column;
    &:hover{
        color:${(props)=>props.theme.white.lighter}
    }
`;



const logoVariants = {
    normal:{   
        fillOpacity:1
    },
    actvice:{
        fillOpacity:[0,1,0],
        transition:{
            duration:1,
            repeat: Infinity
        }
    }
}

const navVariants = {
    top : {
        backgroundColor:"rgba(0,0,0,0)"
    },
    scroll:{
        backgroundColor:"rgba(0,0,0,1)"
    }
}


const Header = () => {
    const [isClicked,setIsClicked] = useState(false);
    const {scrollY} = useScroll();
    const homeMatch = useMatch("");
    const tvMatch = useMatch("tv");
    const searchMatch = useMatch("search");
    const inputAnimation = useAnimation();
    const navAnimation = useAnimation();
    const {register,handleSubmit} = useForm<IForm>();
    const navigate = useNavigate();

    useEffect(()=>{
        scrollY.on("change",()=>{
            if(scrollY.get()>80){
                navAnimation.start("scroll");
            }else{
                navAnimation.start("top");
            }
        })
    },[])

    const toggleSearch = ()=>{
        if(isClicked){
            //trigger close
            inputAnimation.start({
                scaleX:0,
            })
        }else{
            //trigger open
            inputAnimation.start({scaleX:1})
        }
        setIsClicked((prev)=>!prev)
    };

    const onValid = (data:IForm)=>{
        navigate(`search?keyword=${data.keyword}`)
    }

    return (
        <Nav animate={navAnimation} variants ={navVariants} initial={"top"} >
            <Col>
                <Link to={"/"}>
                    <Logo
                        xmlns="http://www.w3.org/2000/svg"
                        width="1024"
                        height="276.742"
                        viewBox="0 0 1024 276.742"
                        variants={logoVariants}
                        initial="normal"
                        whileHover="actvice"
                        >
                        <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                    </Logo>
                </Link>
                <Items>
                    <Link to="/">
                        <Item>
                            Home 
                            {homeMatch? <Circle layoutId='where'/> : null}
                        </Item>
                    </Link>
                    <Link to="/tv">
                        <Item>
                            Tv Shows 
                            {tvMatch? <Circle layoutId='where'/> : null}
                        </Item>
                    </Link>
                    <Link to="/search">
                        <Item>
                            Search 
                            {searchMatch? <Circle layoutId='where'/> : null}
                        </Item>
                    </Link>
                </Items>
            </Col>

            <Col>
                    {/* {clicked? <Input type="text" initial={{width:"0px", left:0}} animate={{width:"100px",left:20}}/> : null} */}
                    <Search onSubmit={handleSubmit(onValid)}>
                        <motion.svg
                            onClick={toggleSearch}
                            animate={{x:isClicked ? -200 : 0}}
                            transition={{type:"linear"}}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                                />
                        </motion.svg>
                        {/* 방법 1 
                        <AnimatePresence>
                            {clicked? <Input type='text' placeholder='Search for movie or tv shows' initial={{width:"0px"}} animate={{width:"100px"}} exit={{width:"0px"}}/>: null}
                        </AnimatePresence> */}
                        <Input 
                            {...register("keyword")}
                            type='text' 
                            placeholder='Search for movie or tv shows' 
                            animate={inputAnimation} 
                            initial={{scaleX:0}} 
                            // animate={ {scaleX: isClicked ? 1 : 0 }} 
                            transition={{type:"linear"}}
                        />
                    </Search>
            </Col>
        </Nav>        
    );
};

export default Header;

function rgba(arg0: number, arg1: number, arg2: number, arg3: number) {
    throw new Error('Function not implemented.');
}
