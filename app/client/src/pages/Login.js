import React, { useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const auth = useAuth();
    const { email, password } = inputs;

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {

            const body = { email, password };
            // console.log(JSON.stringify(body));
            // const response = await fetch("http://localhost:8000/auth/login", {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            });
            const parseResponse = await response.json();
            // console.log(parseResponse);
            // localStorage.setItem("token", parseResponse.token);
            // if (!parseResponse) throw "Invalid login";

            auth.setToken(parseResponse.token);
            // setToken(true); // issue here
            // console.log(auth);
            console.log("Token set");
            console.log("Should redirect to profile");
            // return redirect("/profile");    // doesn't work
            // redirect('/profile');            // doesn't work
            navigate('/profile');



        } catch (err) {
            console.error("Error: " + err);
        }
    };


    return (
        <>
            <div className="container-md p-3 my-3 overflow-hidden" >
                {/* <h1 className="text-center">vFlashCards Login</h1> */}
                <form onSubmit={onSubmitForm}>
                    <input type="email" name="email" placeholder="name@example.com" className="form-control my-2" value={email} onChange={e => onChange(e)} />
                    <input type="password" name="password" placeholder="password" className="form-control my-2" value={password} onChange={e => onChange(e)} />
                    <button className="btn btn-primary btn block">Login</button>
                </form>
            </div>
        </>
    );
}

export default Login;