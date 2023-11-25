import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import FooterComponent from './FooterComponent';
import Home from '../pages/Home';
import Advisor from '../pages/Advisor';

import CityMain from '../pages/CityMain';
import PlacePage from '../pages/PlacePage';
import City from '../pages/City';
import Login from '../pages/Login';
import Write from '../pages/Write';
import Planner from '../pages/Planner';

import Together from '../pages/Together';
import TogetherList from './community/together/TogetherList';
import Community from '../pages/Community';
import useUserStore from '../stores/userStore';
import BottomNav from './BottomNav';
import Mypage from '../pages/Mypage';
import View from './community/planner/View';

import { LoadScript } from '@react-google-maps/api';
import AdvisorRoute from './AdvisorRoute';
import UserRoute from './UserRoute';
import TogetherView from './community/together/TogetherView';
import UserRecovery from '../pages/UserRecovery';

const libraries = ["places"];

const Main = ({ showNavbar }) => {
    
    const {user, getUserByToken} = useUserStore();

    // 렌더링이 시작되면 실행
    const reRenderSite = async() => {
        
        // 로컬 스토리지에 토큰값이 있으면 유저 정보 가져오기
        getUserByToken();
    }

    useEffect(() => {

        reRenderSite();
        

    }, []);
    
    return (
        <div>
            <BrowserRouter>
                <HeaderComponent />
                <Routes>
        
                    <Route path='/' element= { <Home />} />
                    <Route path='user'>
                        <Route path='login' element ={ user.name === '' ? <Login /> : <Navigate to={'/'}></Navigate>} />
                        <Route path='write' element ={ <Write />}/>
                        <Route path='mypage' element ={ 
                            <UserRoute>
                                <Mypage />
                            </UserRoute>
                        }/>
                        <Route path='ID&PasswordRecovery' element={<UserRecovery />} />
                    </Route>
                    <Route path='info'>
                        <Route path='place/:placeSeq' element={ <PlacePage />} />
                        <Route path='cityList' element={ <CityMain />} />
                        <Route path='city/:citySeq' element={ <City />}/>
                    </Route>
                    <Route path='community'>
                        <Route path='' element={ <Community/>}/>
                        <Route path='planner'>
                            <Route path='write' element= { <Planner />} />
                            <Route path='view/:plannerSeq' element={ <View/>} />
                        </Route>
                        <Route path='together'>
                           
                            <Route path='write' element= {  <UserRoute><Together/></UserRoute>} />
                            <Route path='view/:togetherSeq' element= { <TogetherView/>} />
                        </Route>
                    </Route>
                    {showNavbar && <BottomNav showNavbar={showNavbar} />}
                </Routes>

                <FooterComponent />

                    <Routes>
                        <Route path='/advisor' element= { 

                            <AdvisorRoute>
                                <Advisor />
                            </AdvisorRoute>
                            } />
                        
                    </Routes>

            </BrowserRouter>
            <LoadScript
                googleMapsApiKey="AIzaSyBI72p-8y2lH1GriF1k73301yRI4tvOkEo"
                libraries={libraries}
            />
        </div>
    );
};

export default Main;