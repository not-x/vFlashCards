import React, { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";
// import NewCard from "./NewCard";

function EditCardSet() {
    const [inputs, setInputs] = useState({
        title: "",
        access: "private"
    });

    const navigate = useNavigate();

    const { title, access } = inputs;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [cardInfo, setCardInfo] = useState()
    let params = useParams();

    console.log("params: " + params.id);

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };


    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { title, access };
            // console.log("body: " + JSON.stringify(body))
            const response = await fetch("/profile/lib/" + params.id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify(body)
            });

            // console.log("response ok? (response.ok): " + response.ok)
            // console.log("response type: " + typeof(response));
            const cardSet = await response.json()
            // console.log("cardsetID: " + cardSet.vfc_set_id)
            // console.log("cardSet: " + JSON.stringify(cardSet))
            setCardInfo(cardSet);
            

            if (response.ok) {
                setSuccess(true);
                navigate('/profile/lib/' + params.id);
                // navigate('/profile/new/' + params.id);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Server error while updating the flashcard set", error);
            setError(true);
        }
    };
    // console.log(params.id)
    // if (success) navigate('/profile/new/' + params.id);

    return (
        <>
            <div className="container-md p-1 my-3 overflow-hidden" >
                <h5 className="text-center">Update Card Set Title & Access Type</h5>
                <div className="row gx-5">
                    {error && <ErrorAlert details={"Failed to save the content"} />}
                    <form onSubmit={onSubmitForm}>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                name="title"
                                placeholder="Update title"
                                value={title}
                                className="form-control"
                                onChange={e => onChange(e)}
                                autoFocus
                            />
                        </div>

                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="access" value="private" defaultChecked="true" onChange={e => onChange(e)} />
                                Private access (viewable ONLY by you)
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="access" value="public" onChange={e => onChange(e)} />
                                Public access (viewable by everyone else)
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary center">
                            Save & Update Card Set Info
                        </button>
                    </form>
                </div >
            </div >
        </>
    );
}
export default EditCardSet;