export default function Modules() {
  return (
    <div>
      <button>Collapse All</button>  <button>View Progress</button>  <select><option value="Publish All">Publish All</option></select>  <button>+ Module</button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>

          <ul className="wd-Readings">
            <li className="wd-Reading">
              <span className="wd-title">READING</span>
              <ul className="wd-content">
                <li className="wd-content-item">Full stack developer - Chapter 1 - Introduction</li>
                <li className="wd-content-item">Full stack developer - Chapter 2 - Creating</li>
              </ul>
            </li>
          </ul>

          <ul className="wd-slides">
            <li className="wd-slide">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to Web Development</li>
                <li className="wd-content-item">Creating an Http server with NODE.js</li>
                <li className="wd-content-item">Creating an React application</li>
              </ul>
            </li>
          </ul>
        </li>


        <li className="wd-module">
          <div className="wd-title">Week 1, Lecture 2 - Formatting user Interface with HTml</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Learning how to create user interface with HTML</li>
                <li className="wd-content-item">Deploy the assignmnt to netlify</li>
              </ul>
            </li>
          </ul>

          <ul className="wd-slides">
            <li className="wd-slide">
              <span className="wd-title">SLIDES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to HTML and DOM</li>
                <li className="wd-content-item">Formatting Web content with heading</li>
                <li className="wd-content-item">Formatting Web content with List and tables</li>
              </ul>
            </li>
          </ul>
        </li>




        <li className="wd-module">
          <div className="wd-title">Week 2</div>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
        </li>
      </ul>
    </div>
);}
