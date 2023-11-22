import React, { useState } from "react";

const Signup = (setAuth) => {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const { firstName, lastName, email, password } = inputs;

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { firstName, lastName, email, password };
            console.log(JSON.stringify(body));
            const response = await fetch("http://localhost:8000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            const parseResponse = await response.json();
            // console.log(parseResponse);
            localStorage.setItem("token", parseResponse.token);

            setAuth(true);

        } catch (err) {
            console.error("Error: " + err);
        }
    };

    return (
        <>
            <div className="container-md p-4 my-5 border overflow-hidden" >
                <h1 className="text-center">Sign up</h1>
                <form onSubmit={onSubmitForm}>
                    <div className="row gx-5">
                        <div className="col">
                            <input type="text" name="firstName" placeholder="First Name" className="form-control" value={firstName} onChange={e => onChange(e)} />
                        </div>
                        <div className="col">
                            <input type="text" name="lastName" placeholder="Last Name" className="form-control" value={lastName} onChange={e => onChange(e)} />
                        </div>
                    </div>
                    <input type="email" name="email" placeholder="name@example.com" className="form-control my-2" value={email} onChange={e => onChange(e)} />
                    <input type="password" name="password" placeholder="password" className="form-control my-2" value={password} onChange={e => onChange(e)} />
                    <button className="btn btn-success btn block">Create new account</button>
                </form>
            </div>
        </>
    );
}
export default Signup;