import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path='/search' element={<Search />}>
          <Route path=':category/:Id' element={<Search />}/>
        </Route>
        <Route path='/tv' element={<Tv />}/>
        <Route path='/' element={<Home />}>
          <Route path="movie/:category/:movieId" element={<Home />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
