import React from 'react'
import './Footer.css'
const Footer = () => {
  return (
    <div className="footer" id='FOOTER'>
      <div className="footer_head">
        <img src="src\images\team.jpg" alt="" height={100} />
        <h1>  <span className="blue"><strong> Out Team</strong></span> Memeber </h1>
       We are a team of four enthusiastic B.Tech CSE students who collaboratively built a Gas Pipeline Optimizer using React.js and FastAPI. Each member contributed to distinct core modules, including frontend UI, backend algorithms, API development, and project integration
      </div>
      <div className='Footer_body'>
     <div className="first">

          <img src="\src\images\team_member.svg" alt="" width={130} />

          <h1>PARTH</h1>

          <p class="title">TEAM LEADER</p>
          <p className='para_content'>Prim’s Algorithm logic, grid-to-MST transformation & result API and Map integration</p>


        </div>

        <div className="second">
          <img src="\src\images\team_member.svg" alt="" width={130} />
          <h1>PRIYANSHU </h1>
          <p class="title">TEAM MEMBER 02</p>
          <p>React Frontend Development :Grid layout, interaction logic, state management </p>

        </div>




   
        <div className="third">
          <img src="\src\images\team_member.svg" alt="" width={130} />
          <h1>RITESH</h1>
          <p class="title">TEAM MEMBER 03</p>
          <p>A* Algorithm & API endpoint for pathfinding (FastAPI)</p>

        </div>
        <div className="fourth">
          <img src="\src\images\team_member.svg" alt="" width={130} />
          <h1>GAURAV</h1>
          <p class="title">TEAM MEMBER 04</p>
          <p>Backend :API integration in frontend, testing, and documentation</p>

        </div>
      </div>

      <div className="foot">
        <p>Copyright 2022. All rights reserved.  </p>
        <div className="foot_inner">
          <img src="src\images\graphic.jpeg" alt="" height={50} />
          <p><strong>Graphic Era Hill University</strong></p>
        </div>
      </div>
    </div>
  )
}

export default Footer





