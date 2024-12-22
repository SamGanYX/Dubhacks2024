import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import './CreateAccount.css';

const CreateAccount = () => {
  interface DataItem {
    Username: string;
    Email: string;
    Password: string;
  }
  const [Data, setData] = useState<DataItem[]>([]);
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Error, setError] = useState("");
  useEffect(() => {
    fetch("http://localhost:8081/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(Data ? Data : "No_data");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      username: Username,
      email: Email,
      password: Password,
    };
    fetch("http://localhost:8081/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        response.json();
        if(response.status === 201) {
        } else {
          setError('Failed to create account, username taken');
          throw new Error('Error creating account:' + response.statusText);
        }
        console.log("Full response:", response);
      })
      .then((data) => {
        console.log("User added successfully:", data);
        fetch("http://localhost:8081/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userID", data.userID);
            // location.reload();
            window.location.href = "/calculator";
          })
          .catch((error) => {
            console.error("Error logging in:", error);
          });
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };
  return (
    <div className="container">
      <div className="left-section">
        <h1>
          Teen<span className="green-text">FitX</span>
        </h1>
      </div>
      <div className="form-div">
        <h2>Create an Account</h2>
        {Error && <p>{Error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" // Change type to "password"
            name="Password"
            id="Password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Create account
          </button>
        </form>
        <div className="already-have-account">
          <p>Already Have An Account? <a href="/login">Log In</a></p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
