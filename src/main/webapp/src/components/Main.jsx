import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import Home from '../pages/Home';
import Advisor from '../pages/Advisor';
import CityMain from '../pages/CityMain';
import PlacePage from '../pages/PlacePage';
import City from '../pages/City';

const Main = () => {
    return (
        <div>
            <BrowserRouter>
                <HeaderComponent />
                    <Routes>
                        <Route path='/' element= { <Home />} />
                        <Route path='info'>
                            <Route path='place/:placeSeq' element={ <PlacePage />} />
                            <Route path='cityList' element={ <CityMain />} />
                            <Route path='city/:citySeq' element={ <City />}/>
                        </Route>
                    </Routes>
                <FooterComponent />
                    <Routes>
                        <Route path='/advisor' element= { <Advisor />} />
                    </Routes>
            </BrowserRouter>
        </div>
    );
};

export default Main;