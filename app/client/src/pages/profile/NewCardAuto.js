import { useState } from "react";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/ErrorAlert";
import axios from 'axios';

const NewCardAuto = () => {

    let params = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [file, setFile] = useState(null);
    const [apiKey, setAPIKey] = useState("");
    const [success, setSuccess] = useState(false);

    console.log("Autogen cards with LLM");

    const handleFileUpdate = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAPIKeyUpdate = (event) => {
        setAPIKey(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('apiKey', apiKey);

        console.log("Attempting to upload file and API key to generate cards. Awaiting result...");
        console.log("(May take a few minutes.)");
        try {
            const response = await axios.post("/profile/lib/" + params.id + "/autogen", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: localStorage.token,
                },
            });

            console.log("Response data", response);

            // if (response.status === 200) {
            //     // setSuccess = true;
            //     event.target.reset();
            //     console.log("Response: ", response.data);
            //     console.log("Card(s) generated! Redirecting to the card set.");
            //     navigate('/profile/lib/' + params.id);
            // }
            // } else {
            //     console.log("Response: ", response.data);
            //     event.target.reset();
            //     setError(true);
            // }
            setSuccess(true);
            event.target.reset();
            console.log("Cards generated! Redirecting back to the card set.");
            navigate('/profile/lib/' + params.id);
        } catch (error) {
            setError(true);
            console.error("Error: ", error);
        }
    };

    return (
        <>
            <div className="container-md p-1 my-3 overflow-hidden" >
                <h5 className="text-center">🖥️ Autogen Cards with OpenAI 🖥️</h5>
                <p className="text-center">Generate questions & answers from your documents</p>
                {error && <ErrorAlert details={"Please check file type or verify API key."} />}

                <form onSubmit={handleSubmit}>
                    <p>
                        <input type="file" onChange={handleFileUpdate} />
                    </p>
                    <p>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={handleAPIKeyUpdate}
                            placeholder="Enter OpenAI API key"
                        />
                    </p>
                    <button type="submit">📱 Autogen Cards 📱</button>
                </form>
            </div>
        </>
    );
};

export default NewCardAuto;