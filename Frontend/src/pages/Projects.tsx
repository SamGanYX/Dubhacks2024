import React, { useState, useEffect } from "react";
import ProjectsTable from "../components/ProjectsTable";
import "./Projects.css";

const Projects = () => {
  const userID = localStorage.getItem("userID");
  const [categoryID, setCategoryID] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [fundGoal, setFundGoal] = useState("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(
    null
  );
  const [images, setImages] = useState<FileList | null>(null); // State to handle multiple images
  interface Category {
    categoryID: number;
    categoryName: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch("http://localhost:8081/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userID", userID as string);
    formData.append("categoryID", categoryID);
    formData.append("projectName", projectName);
    formData.append("projectDescription", projectDescription);
    formData.append("fundGoal", fundGoal);
    formData.append("endDate", endDate);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]); // `images` will be an array of files
      }
    }

    fetch("http://localhost:8081/projects_with_image", {
      method: "POST",
      body: formData, // FormData automatically sets the correct headers
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
        // Handle successful creation, e.g., redirect or show a message
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  return (
    <div className="container">
      <div className="projects-form-div form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategoryID || ""}
              onChange={(e) => {
                setSelectedCategoryID(Number(e.target.value));
                setCategoryID(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              id="projectName"
              type="text"
              placeholder="Enter Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDescription">Project Description</label>
            <textarea
              id="projectDescription"
              placeholder="Enter Project Description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fundGoal">Funding Goal</label>
            <input
              id="fundGoal"
              type="number"
              placeholder="Enter Funding Goal"
              value={fundGoal}
              onChange={(e) => setFundGoal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              id="images"
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)} // Allow multiple image selection
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
        </form>
      </div>
      <ProjectsTable></ProjectsTable>
    </div>
  );
};

export default Projects;
