import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';

import logo from '../assets/image/Logo.png';

import  styles  from"../css/Header.module.css";
import BottomNav from './BottomNav';

const linkStyle = {
    textDecoration: 'none',
    color: 'inherit'
};

const HeaderComponent = () => {
    const [prevScrollY, setPrevScrollY] = useState(0);
    const [showNavbar, setShowNavbar] = useState(true);
    
    useEffect(() => {
      const handleScroll = () => {
        const scrollY = window.scrollY;
  
        // 이전 스크롤 위치와 현재 스크롤 위치 비교
        if (scrollY > prevScrollY) {
          setShowNavbar(false)
        } else {
          setShowNavbar(true)
        }
  
        setPrevScrollY(scrollY);
      };
  
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [prevScrollY, showNavbar]);

    const location = useLocation();
    const { cityseq } = useParams();

    const [selectedCity, setSelectedCity] = useState('')

    return (
        <div>
            {showNavbar && <BottomNav showNavbar={showNavbar} />}
            <header className={ styles.header }>
                <div className={ styles.logo }>
                    <Link to='/' style={ linkStyle }>
                        <img src={ logo } alt='로고' />
                    </Link>
                </div>
                <nav className={styles.nav}>
                  <ul>
                    <li>
                      <NavLink
                        to='/'
                        style={location.pathname === '/' ? { color: '#2E8DFF' } : {}}
                        activeClassName={styles.activeLink}
                        className={styles.activeL}
                      >
                        홈
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to='/info/cityList'
                        style={location.pathname === '/info/cityList' ? { color: '#2E8DFF' } : {}}
                        activeClassName={styles.activeLink}
                        className={styles.activeL}
                      >
                        여행정보
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to='/travel'
                        style={location.pathname === '/travel' ? { color: '#2E8DFF' } : {}}
                        activeClassName={styles.activeLink}
                        className={styles.activeL}
                      >
                        커뮤니티
                      </NavLink>
                    </li>
                  </ul>
                </nav>
                <div className={ styles['login_section'] }>
                    <NavLink 
                    to='/user/login'
                    style={location.pathname === '/user/login' ? { color: '#2E8DFF' } : {}}
                    className={styles.activeL}
                    >
                      로그인
                    </NavLink> &nbsp;
                    <p>/</p>&nbsp;
                    <NavLink 
                    to='/user/write' 
                    style={location.pathname === '/user/write' ? { color: '#2E8DFF' } : {}}
                    className={styles.activeL}
                    >
                      회원가입
                    </NavLink>
                </div>
            </header>
        </div>
    );
};

export default HeaderComponent;