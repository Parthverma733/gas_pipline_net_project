


import Navigation from '../components/Navigation';
import RouteMap from '../components/RouteMap'
import './Home.css';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Grid from '../components/Grid';
import Head from '../components/Head';


gsap.registerPlugin(ScrollTrigger);

const Home = () => {


  const homeRef = useRef(null);

  useEffect(() => {
    gsap.to(homeRef.current,
      {

        scale: 0.5,
        opacity: 0.5,
        duration: 0.6,
        ease: "power1.inout",
        scrollTrigger: {
          trigger: homeRef.current,

          start: " top 50%",
          end: "bottom 10%",

          scrub: true,



        }
      }
    );


    ScrollTrigger.refresh();


  }, []);




  return (
    <div className='Homepage' >

      <Head></Head>
      <div className="section" id='Home' ref={homeRef} >
        <div className="leftsection">
          <h1><span className="blue">Algorithm</span> Used</h1>

          <div className="left_content">


            <span className="blue">A</span> Star <span className="blue">-</span>
            <div className="a_star"> In this project, A* is used to lay pipeline paths between gas stations and houses while avoiding walls and minimizing cost.</div>


            <span className="blue">Prims-</span>
            <div className="prims"> Here, it's used to optimize the gas pipeline network, ensuring an efficient connection layout that minimizes redundancy and cost.
            </div>

          </div>


        </div>

        <div className="rightsection" >




        </div>
      </div>

      <Hero></Hero>


      <Grid m={15} n={35} />
      <RouteMap/>
      <Footer></Footer>
    </div>
  );
};

export default Home;

