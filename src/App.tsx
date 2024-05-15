import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';
import Header from './Components/Header';
import Footer from './Components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/search' element={<Search />}/>
        <Route path='/tv' element={<Tv />}/>
        <Route path='/' element={<Home />}>
          <Route path="movie/:category/:movieId" />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
