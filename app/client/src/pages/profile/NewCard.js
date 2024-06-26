import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import { useNavigate } from "react-router-dom";

const NewCard = () => {
    const [inputs, setInputs] = useState({
        answer: "",
        question: "",
        createAnotherCard: "true",
    });
    console.log("Create new card");
    const { answer, question, createAnotherCard } = inputs;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    let params = useParams();
    const navigate = useNavigate();

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { answer, question };
            const response = await fetch("/profile/lib/" + params.id, {
                method: "POST",
                // credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify(body)
            });

            // const result = await response.json();
            // console.log("response ok? (response.ok): " + response.ok)
            // console.log("response type: " + typeof(response));

            // e.target.reset();        // Attempt to reset fields does not work
            console.log("createAnotherCard: " + createAnotherCard)
            if (response.ok && createAnotherCard === "true") {
                setSuccess(true);
                e.target.reset();
                console.log("Card created. Create another");
                // navigate('/profile/new/' + params.cardSetID);

                navigate('/profile/new/' + params.id);
            } else if (response.ok && createAnotherCard === "false") {
                setSuccess(true);
                console.log("Card created. Do not create another card. Redirecting to personal lib.");
                navigate('/profile/lib/' + params.id);
            }
            else {
                setError(true);
            }
        } catch (error) {
            console.error("Server error while creating a new flashcard", error);
            setError(true);
        }
    };

    return (
        <>
            <div className="container-md p-1 my-3 overflow-hidden" >
                <h5 className="text-center">Create New Card</h5>
                {error && <ErrorAlert details={"Failed to save the content"} />}
                <form onSubmit={onSubmitForm}>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            name="question"
                            placeholder="Enter question"
                            value={question}
                            className="form-control"
                            onChange={e => onChange(e)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="answer"
                            placeholder="Enter answer"
                            value={answer}
                            className="form-control"
                            onChange={e => onChange(e)}
                        />
                    </div>

                    <div className="form-check">
                        <label>
                            <input
                                type="radio" name="createAnotherCard" value="true" defaultChecked="true" onChange={e => onChange(e)} />
                            Create another after save.
                        </label>
                    </div>
                    <div className="form-check">
                        <label>
                            <input
                                type="radio" name="createAnotherCard" value="false" onChange={e => onChange(e)} />
                            Return to cards after save.
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary center">
                        Save / Create New Card
                    </button>
                </form>
            </div >
        </>
    );
}
export default NewCard