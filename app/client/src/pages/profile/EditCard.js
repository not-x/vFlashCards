import React, { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import { useParams } from "react-router-dom";
// import NewCard from "./NewCard";

function EditCard() {
    const navigate = useNavigate();
    let params = useParams();
    const [inputs, setInputs] = useState({
        question: "",
        answer: "",
    });

    const { question, answer } = inputs;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [cardInfo, setCardInfo] = useState()
    



    console.log("params: " + params.id);
    console.log("params: " + params.id2)

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };


    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { question, answer };
            // console.log("body: " + JSON.stringify(body))
            const response = await fetch("/profile/lib/" + params.id + "/" + params.id2, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify(body)
            });

            // console.log("response ok? (response.ok): " + response.ok)
            // console.log("response type: " + typeof(response));
            const result = await response.json()
            // console.log("cardsetID: " + cardSet.vfc_set_id)
            // console.log("cardSet: " + JSON.stringify(cardSet))
            setCardInfo(result);


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
                <h5 className="text-center">Update Card Question & Answer</h5>
                <div className="row gx-5">
                    {error && <ErrorAlert details={"Failed to update the card"} />}
                    <form onSubmit={onSubmitForm}>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                name="question"
                                placeholder="Revise your question here"
                                value={question}
                                className="form-control"
                                onChange={e => onChange(e)}
                                autoFocus
                            />
                        </div>
                        <div className="input-group mb-2">
                            <input
                                type="text"
                                name="answer"
                                placeholder="Revise your answer here"
                                value={answer}
                                className="form-control"
                                onChange={e => onChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary center">
                            Update Card Info
                        </button>
                    </form>
                </div >
            </div >
        </>
    );
}
export default EditCard;