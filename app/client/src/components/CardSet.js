import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";

function CardSet({ vfc_set_id, vfc_set_title, vfc_set_access }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const onSubmitForm = async e => {
    e.preventDefault();
    console.log("params: " + vfc_set_id)
    try {
        // const body = { title, access };
        // console.log("body: " + JSON.stringify(body))
        const response = await fetch("/profile/lib/" + vfc_set_id, {
            method: "DELETE",
            // credentials: "include",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.token,
            },
            // headers: { token: localStorage.token },
            // body: JSON.stringify({
            //     content: body,
            // }),
            // body: JSON.stringify(body)
        });

        // console.log("response ok? (response.ok): " + response.ok)
        // console.log("response type: " + typeof(response));
        const result = await response.json()
  
        

        if (response.ok) {
            setSuccess(true);
            // navigate('/profile/new/' + params.id);
        } else {
            setError(true);
        }
    } catch (error) {
        console.error("Server error while delete the flashcard set", error);
        setError(true);
    }
};

  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="card mb-4 shadow">
        <div className="card-body card-text">
          <Link to={"/profile/lib/" + vfc_set_id}>{vfc_set_title}</Link>
        </div>
        <div className="card-body card-text">
          <Link className="link-secondary link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
            to={"/profile/edit/" + vfc_set_id}><p className="fs-6">Update Title & Access Type</p></Link>
        </div>
        <div className="card-footer small text-muted text-end">Access: {vfc_set_access}
        {error && <ErrorAlert details={"Failed to delete the set. Delete cards first."} />}
        <form onSubmit={onSubmitForm}><button className="btn btn-outline-danger">Delete</button></form>
        </div>
      
      </div>
    </div>
  );
}

export default CardSet;