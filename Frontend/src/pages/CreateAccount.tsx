import React, { useEffect, useState } from "react";
import Table from "../components/Table";
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
            // location.reload();
            window.location.href = "/home";
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
      <div className="form-div">
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
            type="text"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
