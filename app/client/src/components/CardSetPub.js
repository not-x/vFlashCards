import React from "react";
import { Link } from "react-router-dom";

function CardSet({ vfc_set_id, vfc_set_title, vfc_set_access }) {
  return (
    <div className="col-10 col-md-8 col-lg-7">
      <div className="card mb-4 shadow">
        <div className="card-body card-text">
          <Link to={"/profile/pub_lib/" + vfc_set_id}>{vfc_set_title}</Link>
        </div>
        <div className="card-footer small text-muted text-end">Access: {vfc_set_access}</div>
      </div>
    </div>
  );
}

export default CardSet;
