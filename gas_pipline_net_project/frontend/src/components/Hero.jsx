


import './Hero.css';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);


  useEffect(() => {


    gsap.to(titleRef.current, {
      x: 0,
      z: -1,
      opacity: 1,
      delay: 0.6,
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 85%',
        end: 'bottom 35%',
        scrub: 1,


      }
    });

    gsap.to(contentRef.current, {
      x: 0,
      z: -1,
      opacity: 1,
      delay: 0.6,
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 90%',
        end: 'bottom 40%',
        scrub: 1,
      }
    });
  }, []);


  return (
    <div className='Hero_section'>
      <div className="heroleft"></div>

      <div className="heroright">
        <div className="hero_title" ref={titleRef}>
          <span className="blue"><strong>Main</strong></span> <strong>Aim</strong>
        </div>

        <div className="hero_content" ref={contentRef}>

         The main aim of this project is to design an efficient and interactive system that optimizes gas pipeline connections between gas stations and houses using intelligent pathfinding algorithms like A and Prim’s, while providing a user-friendly visualization through a web interface.

          In regions like Uttarakhand, especially in hilly and remote areas, such digital pipeline planning and optimization systems are not yet developed. Our solution aims to bridge this gap by providing a smart, scalable, and cost-effective approach for better infrastructure planning in such terrains.

        </div>
      </div>
    </div>
  );
};

export default Hero;

