import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import './NotFound.css';

const NotFound = () => {
  useEffect(() => {
    //=============== SHOW MENU ===============
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');

    //===== MENU SHOW =====
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
      });
    }

    //===== MENU HIDDEN =====
    if (navClose) {
      navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
      });
    }

    //=============== REMOVE MENU MOBILE ===============
    const navLinks = document.querySelectorAll('.nav__link');

    function linkAction() {
      navMenu.classList.remove('show-menu');
    }

    navLinks.forEach(n => n.addEventListener('click', linkAction));

    // Cleanup event listeners
    return () => {
      if (navToggle) {
        navToggle.removeEventListener('click', () => {
          navMenu.classList.add('show-menu');
        });
      }

      if (navClose) {
        navClose.removeEventListener('click', () => {
          navMenu.classList.remove('show-menu');
        });
      }

      navLinks.forEach(n => n.removeEventListener('click', linkAction));
    };
  }, []);

  return (
    <div className="not-found-page">
      {/* Header */}
      <header className="header">
        <nav className="nav container">
          <Link to="/" className="nav__logo">
            LOGO
          </Link>

          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li className="nav__item">
                <Link to="/" className="nav__link">Home</Link>
              </li>
              <li className="nav__item">
                <Link to="/about" className="nav__link">About</Link>
              </li>
              <li className="nav__item">
                <Link to="/contact" className="nav__link">Contact</Link>
              </li>
            </ul>

            <div className="nav__close" id="nav-close">
              <i className='bx bx-x'></i>
            </div>
          </div>

          {/* Toggle button */}
          <div className="nav__toggle" id="nav-toggle">
            <i className='bx bx-grid-alt'></i>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        <section className="home">
          <div className="home__container container">
            <div className="home__data">
              <span className="home__subtitle">Error 404</span>
              <h1 className="home__title">Hey Buddy</h1>
              <Typography variant="body1" className="home__description">
                We can't seem to find the page <br /> you are looking for.
              </Typography>
              <Button 
                component={Link} 
                to="/" 
                variant="contained" 
                className="home__button"
              >
                Go Home
              </Button>
            </div>

            <div className="home__img">
              <img src="/404-ghost.png" alt="Ghost" />
              <div className="home__shadow"></div>
            </div>
          </div>

          <footer className="home__footer">
            <span>(554) 987-654</span>
            <span>|</span>
            <span>info@company.com</span>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default NotFound;