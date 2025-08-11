import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5">
      {/* Bootstrap Carousel */}
      <div id="carouselExampleIndicators" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded shadow">
          <div className="carousel-item active">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=1200"
              className="d-block w-100"
              alt="Career Guidance"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=1200"
              className="d-block w-100"
              alt="Artificial Intelligence and Jobs"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=1200"
              className="d-block w-100"
              alt="Resume Upload"
            />
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Heading and CTA */}
      <div className="text-center">
        <h1 className="display-5 fw-bold">AI-Powered Career Guidance</h1>
        <p className="lead">Upload your resume and let our AI suggest your ideal role based on skills and profile.</p>
        <Link to="/predict" className="btn btn-primary btn-lg mt-3 shadow">
          Start Prediction
        </Link>
      </div>
    </div>
  );
}
export default Home;
