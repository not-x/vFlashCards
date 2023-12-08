import React from "react";
import { Link } from "react-router-dom";

// Question/front of the card should display the same card but with the response
// Navbar needs to be added to the bottom of the card
function Card({ vfc_set_title, vfc_set_id, vfc_id, vfc_question, vfc_answer }) {
  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="card mb-4 shadow">
        <div className="card-body card-text">
          {/* <Link to={"/profile/lib/" + vfc_set_id}>{vfc_question}</Link> */}
        </div>
        <div className="card-footer small text-muted text-end">Card#: {vfc_id}</div>
      </div>
    </div>
  );
}

export default Card;
