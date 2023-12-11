import React, { useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { useParams, useNavigate} from "react-router-dom";


function Card({ vfc_set_title, vfc_set_id, vfc_id, vfc_question, vfc_answer }) {

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [side, setSide] = useState(vfc_question);
  const navigate = useNavigate();
  let params = useParams();

  console.log("params: " + params)
  // console.log("Current side: " + side + " Type: " + typeof(side))
  // console.log("typeof(vfc_answer): " + typeof(vfc_answer));
  const handleClick = (e) => {
    if (side === vfc_question) {
      console.log("set to answer")
      setSide(vfc_answer)
    } else {
      console.log("set to question")
      setSide(vfc_question)
    }
    console.log("Card has been set to: " + side)
  }

  const onClick = async e => {
    e.preventDefault();
    console.log("params: " + vfc_set_id)
    try {
      // const body = { title, access };
      // console.log("body: " + JSON.stringify(body))
      const response = await fetch("/profile/lib/" + vfc_set_id + "/" + vfc_id, {
        method: "DELETE",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      });

      // console.log("response ok? (response.ok): " + response.ok)
      // console.log("response type: " + typeof(response));
      const result = await response.json()



      if (response.ok) {
        setSuccess(true);
        navigate('/profile/lib/' + params.id);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Server error while delete the flashcard set", error);
      setError(true);
    }
  };

  const onClick2 = e => {
    navigate('/profile/edit/' + vfc_set_id + "/" + vfc_id);
  }


  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="card mb-4 shadow">
        <div className="card-body card-text">
          {/* <Link to={"/profile/lib/" + vfc_set_id}>{vfc_question}</Link> */}
          {side}
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={handleClick}>Flip Card</button>

        {/* <div className="card-footer small text-muted text-end">Card#: {vfc_id} | {vfc_set_title} | {vfc_set_id}</div> */}
        <div className="card-footer small text-muted text-end">
          <form onSubmit={onClick}><button className="btn btn-outline-danger btn-sm">Delete</button></form>
          <form onSubmit={onClick2}><button className="btn btn-outline-warning btn-sm">Edit Card</button></form>
        </div>
      </div>
    </div>
  );
}

export default Card;
