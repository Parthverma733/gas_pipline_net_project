

import './Head.css'
import Navigation from './Navigation'
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const Head = () => {



    const headingRef = useRef(null);

    useEffect(() => {
        gsap.to(headingRef.current,
            {

                scale: 0.5,
                opacity: 0,
                duration: 1,
                ease: "power1.inout",


                scrollTrigger: {
                    trigger: headingRef.current,
                    start: " top 50%",
                    end: "bottom 10%",
                    scrub: true,



                }
            }
        );


        ScrollTrigger.refresh();


    }, [headingRef]);

    return (
        <>

            <Navigation />
            <div
                ref={headingRef}
                className="head_content">


                <main className='headclass'>


                    <div className="variable">
                        <span className="work"><strong>PIPE</strong></span>Line

                    </div>
                    <div className="static">OPTIMIZER  </div>




                </main>
            </div>
        </>
    )
}

export default Head






