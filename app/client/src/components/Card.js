import React, { useState } from "react";
import { Link } from "react-router-dom";


function Card({ vfc_set_title, vfc_set_id, vfc_id, vfc_question, vfc_answer }) {

  const [side, setSide] = useState(vfc_question);
  // console.log("Current side: " + side + " Type: " + typeof(side))
  // console.log("typeof(vfc_answer): " + typeof(vfc_answer));
  const handleClick = (e) => {
    if (side === vfc_question) {
      console.log("set to answer")
      setSide( vfc_answer )
    } else {
      console.log("set to question")
      setSide( vfc_question )
    }
    console.log("Card has been set to: " + side)

  }


  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="card mb-4 shadow">
        <div className="card-body card-text">
          {/* <Link to={"/profile/lib/" + vfc_set_id}>{vfc_question}</Link> */}
          {side}
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={handleClick}>Flip Card</button>

        <div className="card-footer small text-muted text-end">Card#: {vfc_id}</div>
      </div>
    </div>
  );
}

export default Card;
