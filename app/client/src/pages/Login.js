import React, { useState } from "react";

const Login = ({setToken}) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });


    const { email, password } = inputs;

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { email, password };
            console.log(JSON.stringify(body));
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const parseResponse = await response.json();
            // console.log(parseResponse);
            localStorage.setItem("token", parseResponse.token);

            setToken(true);

        } catch (err) {
            console.error("Error: " + err);
        }
    };


    return (
        <>
            <div className="container-md p-4 my-5 border overflow-hidden" >
                <h1 className="text-center">vFlashCards Login</h1>
                <form onSubmit={onSubmitForm}>
                    <input type="email" name="email" placeholder="name@example.com" className="form-control my-2" value={email} onChange={e => onChange(e)} />
                    <input type="password" name="password" placeholder="password" className="form-control my-2" value={password} onChange={e => onChange(e)} />
                    <button className="btn btn-success btn block">Login</button>
                </form>
            </div>
        </>
    );
}

export default Login;