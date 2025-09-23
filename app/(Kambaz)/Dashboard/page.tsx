import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image alt="react" src="/images/reactjs.jpg" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1111" className="wd-dashboard-course-link">
            <Image alt="HTML" src="/images/HTML.jpg" width={200} height={150} />
            <div>
              <h5> CS1111 HTML </h5>
              <p className="wd-dashboard-course-title">
                HTML DEVELOPER
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1222" className="wd-dashboard-course-link">
            <Image alt="CSS" src="/images/CSS.jpg" width={200} height={150} />
            <div>
              <h5> CS1222 CSS </h5>
              <p className="wd-dashboard-course-title">
                CSS developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1333" className="wd-dashboard-course-link">
            <Image alt="JAVA" src="/images/JAVA.jpg" width={200} height={150} />
            <div>
              <h5> CS1333 JAVA </h5>
              <p className="wd-dashboard-course-title">
                JAVA developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1444" className="wd-dashboard-course-link">
            <Image alt="PYTHON" src="/images/PYTHON.jpg" width={200} height={150} />
            <div>
              <h5> CS1444 PYTHON </h5>
              <p className="wd-dashboard-course-title">
                PYTHON developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1555" className="wd-dashboard-course-link">
            <Image alt="DBMS" src="/images/DBMS.jpg" width={200} height={150} />
            <div>
              <h5> CS1555 DBMS </h5>
              <p className="wd-dashboard-course-title">
                DATABASE developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br></br>
        <div className="wd-dashboard-course">
          <Link href="/Courses/1666" className="wd-dashboard-course-link">
            <Image alt="NODE" src="/images/NODE.jpg" width={200} height={150} />
            <div>
              <h5> CS1666 NODE </h5>
              <p className="wd-dashboard-course-title">
                software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}
