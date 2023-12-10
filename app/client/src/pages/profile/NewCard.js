import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import { useNavigate } from "react-router-dom";

const NewCard = () => {

    const [inputs, setInputs] = useState({
        answer: "",
        question: "",
    });

    const {answer, question} = inputs;
    const [success, setSuccess]= useState(false);
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
            // console.log("body: " + JSON.stringify(body))
            const response = await fetch("/profile/lib/" + params.cardSetID, {
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
     

            if (response.ok) {
                setSuccess(true);
                navigate('/profile/new/' + params.cardSetID);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error("Server error while creating a new flashcard", error);
            setError(true);
        }
    };

    return (
        <>
            <h1>New Card</h1>
        </>
    );
}
export default NewCard