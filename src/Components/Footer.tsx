import React from 'react';
import styled from 'styled-components';
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
`;


const Footer = () => {
    return (
        <Wrapper>
            <p>© Copyright 2023. Leesu All rights reserved.</p>
        </Wrapper>        
    );
};

export default Footer