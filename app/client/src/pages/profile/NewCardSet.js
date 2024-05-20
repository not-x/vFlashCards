import React, { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";
import { useRef } from 'react';
// import NewCard from "./NewCard";

function NewCardSet() {
    const [inputs, setInputs] = useState({
        title: "",
        access: "private",
        // for auto gen
        newCardType: "manual"
    });

    const navigate = useNavigate();

    const { title, access } = inputs;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [cardInfo, setCardInfo] = useState()
    let params = useParams();
    const formRef = useRef();

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };


    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { title, access };
            // console.log("body: " + JSON.stringify(body))
            const response = await fetch("/profile/new_set", {
                method: "POST",
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                // headers: { token: localStorage.token },
                // body: JSON.stringify({
                //     content: body,
                // }),
                body: JSON.stringify(body)
            });

            // console.log("response ok? (response.ok): " + response.ok)
            // console.log("response type: " + typeof(response));
            const cardSet = await response.json()
            // console.log("cardsetID: " + cardSet.vfc_set_id)
            // console.log("cardSet: " + JSON.stringify(cardSet))
            setCardInfo(cardSet);


            // if (response.ok) {
            //     setSuccess(true);
            //     navigate('/profile/new/' + (cardSet.vfc_set_id));
            //     // navigate('/profile/new/' + params.id);
            // } else {
            //     setError(true);
            // }

            if (response.ok) {
                setSuccess(true);
                navigate('/profile/new/' + (cardSet.vfc_set_id));
                // navigate('/profile/new/' + params.id);
                // } else if (response.ok) {
                //     setSuccess(true);
                //     navigate('/profile/autogen' + (cardSet.vfc_set_id));
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Server error while creating a new flashcard set", error);
            setError(true);
        }
    };

    const onSubmitForm2 = async e => {
        e.preventDefault();
        try {
            const body = { title, access };
            // console.log("body: " + JSON.stringify(body))
            const response = await fetch("/profile/new_set", {
                method: "POST",
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                // headers: { token: localStorage.token },
                // body: JSON.stringify({
                //     content: body,
                // }),
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
                navigate('/profile/autogen/' + (cardSet.vfc_set_id));
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Server error while creating a new flashcard set", error);
            setError(true);
        }
    };
    // console.log(params.id)
    // if (success) navigate('/profile/new/' + params.id);

    return (
        <>
            <div className="container-md p-1 my-3 overflow-hidden" >
                <h5 className="text-center">Create New Set of vFlashCards</h5>
                <div className="row gx-5">
                    {error && <ErrorAlert details={"Failed to save content"} />}
                    <form ref={formRef}>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter title for the new card set"
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
                                Private access (default)
                            </label>
                        </div>
                        <div className="form-check">
                            <label>
                                <input
                                    type="radio" name="access" value="public" onChange={e => onChange(e)} />
                                Public access (viewable by everyone)
                            </label>
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit" className="btn btn-primary center" onClick={onSubmitForm}>
                                Save & Create New Cards
                            </button>
                            <button type="submit" className="btn btn-warning center" onClick={onSubmitForm2}>
                                Save & AutoGen Cards with OpenAI
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    );
}
export default NewCardSet;