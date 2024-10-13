import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import logo from "../images/logo_1.png"; 
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [welcomeAnimationDone, setWelcomeAnimationDone] = useState(false);
  const [stepAnimationDone, setStepAnimationDone] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(true);
  let lastScrollY = 0;
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }

      lastScrollY = currentScrollY;

      const stepsSection = document.getElementById("steps");
      const contactSection = document.getElementById("contact");
      const stepsRect = stepsSection.getBoundingClientRect();
      const contactRect = contactSection.getBoundingClientRect();

      // Check if steps section is visible and scrolling down
      if (
        stepsRect.top >= 0 &&
        stepsRect.bottom <= window.innerHeight &&
        scrollingDown
      ) {
        setStepAnimationDone(true);
      }

      // Optionally, you can also handle contact section visibility
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollingDown]);

  const handleWelcomeAnimationEnd = () => {
    setWelcomeAnimationDone(true);
  };

  return (
    <div className="landing-container">
      <img src={logo} alt="Logo" className="logo" />
      <nav className="navbar">
        <ul>
          <li>
            <a href="#about">About Us</a>
          </li>
          <li>
            <a href="#steps">Steps to Use the App</a>
          </li>
          <li>
            <a href="#contact">Contact Us</a>
          </li>
        </ul>
      </nav>

      <div
        className={`landing-header ${welcomeAnimationDone ? "fade-out" : ""}`}
        onAnimationEnd={handleWelcomeAnimationEnd}
      >
        <h1>Welcome to DDBMS</h1>
        <p>Your one-stop solution for seamless connectivity and engagement.</p>
        <button className="cta-button" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>

      <div
        id="about"
        className={`content-section ${welcomeAnimationDone ? "fade-in" : ""}`}
      >
        <h2>About Us</h2>
        <div className="text-container">
          <div className="animated-box left-animation">
            <p>
              DDBMS is a collaborative project developed by third-year students
              from the Computer Science Engineering (Artificial Intelligence)
              branch, Division A, at G.H. Raisoni College of Engineering and
              Management, Pune. Our initiative focuses on enhancing the
              educational experience by providing tools that assist teachers in
              managing assignments and improving student engagement.
            </p>
          </div>
          <div className="animated-box right-animation">
            <p>
              In today’s fast-paced educational environment, effective
              communication and organization are paramount. DDBMS aims to
              streamline the assignment process, enabling educators to
              efficiently create, distribute, and track assignments, ensuring
              that no student is left behind.
            </p>
          </div>
          <div className="animated-box left-animation">
            <p>
              Our platform fosters a supportive environment where teachers can
              share resources and gather feedback, ultimately leading to a more
              productive classroom atmosphere. With user-friendly features and
              intuitive design, we strive to make the educational process
              smoother for both teachers and students.
            </p>
          </div>
          <div className="animated-box right-animation">
            <p>
              By bridging the gap between educators and learners, DDBMS reflects
              our commitment to addressing the challenges faced in modern
              education. We believe that through collaboration and innovative
              solutions, we can contribute positively to the learning journey.
            </p>
          </div>
        </div>
      </div>

      <div
        id="steps"
        className={`content-section ${stepAnimationDone ? "fade-in" : ""}`}
      >
        <h2>Steps to Use the App</h2>
        <div className="steps-container">
          <div className={`step animated-box step1`}>
            <h3>Step 1: Create a Class in Classroom</h3>
            <p>
              Set up your class by providing the necessary details. This will be
              the foundation for managing your assignments and interactions.
            </p>
          </div>
          <div className={`step animated-box step2`}>
            <h3>Step 2: Log In</h3>
            <p>
              Log in to your account to access the dashboard and all available
              features.
            </p>
          </div>
          <div className={`step animated-box step3`}>
            <h3>Step 3: Manage Assignments</h3>
            <p>
              Easily create and manage assignments, set deadlines, and track
              submissions.
            </p>
          </div>
          <div className={`step animated-box step4`}>
            <h3>Step 4: Engage with Students</h3>
            <p>
              Interact with students through feedback and discussions to enhance
              their learning experience.
            </p>
          </div>
          <div className={`step animated-box step5`}>
            <h3>Step 5: Review and Improve</h3>
            <p>
              Analyze student submissions and feedback to continuously improve
              your teaching methods.
            </p>
          </div>
        </div>
      </div>

      <div id="contact" className="content-section">
        <h2>Contact Us</h2>
        <div className="text-container">
          <div className="animated-box left-animation">
            <p>
              For any inquiries, please reach out to us at:{" "}
              <strong>support@pksa.com</strong>
            </p>
          </div>
          <div className="animated-box right-animation">
            <p>You can also follow us on our social media platforms:</p>
            <ul>
              <li>Facebook: PKSA</li>
              <li>Twitter: @PKSA</li>
              <li>LinkedIn: PKSA</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="landing-footer">© 2024 PKSA</div>
    </div>
  );
};

export default LandingPage;
