const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const multer = require('multer');
const path = require('path');

const db = mysql.createConnection({
    host:"127.0.0.1",
    user: 'root',
    password: 'password',
    database:"ReactApp"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name with timestamp
  },
});

const upload = multer({ storage: storage });

app.post('/projects_with_image', upload.array('images', 10), (req, res) => {
    // console.log(req);
    const { userID, categoryID, projectName, projectDescription, fundGoal, endDate } = req.body;
    // const imageURL = req.file ? `/uploads/${req.file.filename}` : null;
    const sql = `
      INSERT INTO projects (userID, categoryID, projectName, projectDescription, fundGoal, endDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [userID, categoryID, projectName, projectDescription, fundGoal, endDate];
  
    db.query(sql, values, (err, result) => {
        console.log(result);
        const projectID = result.insertId;
      if (err) return res.status(500).json(err);
      if (req.files && req.files.length > 0) {
        const imageSQL = "INSERT INTO project_images (projectID, imageURL) VALUES ?";
        const imageValues = req.files.map(file => [projectID, file.filename]);
  
        db.query(imageSQL, [imageValues], (imageErr) => {
          if (imageErr) return res.status(500).json(imageErr);
        });
      }
      res.status(200).json({ message: "Project created successfully", projectID: result.insertId });
    });
  });

// Static route to serve uploaded images
app.use('/uploads', express.static('uploads'));

// Rest of your Express setup...

const bcrypt = require('bcryptjs');

const saltRounds = 10;
const password = "password";
const hashedPassword = bcrypt.hashSync(password, saltRounds);

// Get

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users;"
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

// app.get('/categories', (req, res) => {
//     const sql = "SELECT * FROM categories;"
//     db.query(sql, (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// });

// app.get('/projects', (req, res) => {
//     const sql = "SELECT * FROM projects;"
//     db.query(sql, (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     })
// });

// app.get('/projects/category/:categoryName', (req, res) => {
//     const { categoryName } = req.params;
  
//     const sql = `
//       SELECT p.*
//       FROM projects p
//       JOIN categories c ON p.categoryID = c.categoryID
//       WHERE c.categoryName = ?;
//     `;
  
//     db.query(sql, [categoryName], (err, results) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error retrieving projects', err });
//       }
  
//       return res.status(200).json(results);
//     });
// });

// Post


app.post('/users', (req, res) => {
    const { username, email, password } = req.body;
    
    const sql = "INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?);";
    db.query(sql, [username, email, password], (err, data) => {
        console.log(err);
        if (err) return res.status(500).json(err);
        return res.status(201).json("User added successfully");
    });
});

app.post('/update_users', (req, res) => {
    const { username, email, password, id } = req.body;
    
    const sql = "UPDATE users SET Username = ?, Email = ?, Password = ? WHERE id = ?;";
    db.query(sql, [username, email, password, id], (err, data) => {
        console.log(err);
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ message: "User updated successfully" });
    });
});

app.post('/delete_users', (req, res) => {
    const { id } = req.body;
    
    const sql = "DELETE FROM users WHERE id = ?;";
    db.query(sql, [id], (err, data) => {
        console.log(err);
        if (err) return res.status(500).json(err);
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ message: "User Deleted successfully" });
    });
});

// app.post('/projects', (req, res) => {
//     const { userID, categoryID, projectName, projectDescription, fundGoal, endDate } = req.body;

//     const startDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
//     const sql = `
//         INSERT INTO projects (userID, categoryID, projectName, projectDescription, startDate, endDate, fundGoal, fundAmount)
//         VALUES (?, ?, ?, ?, ?, ?, ?, 0);
//     `;
//     db.query(sql, [userID, categoryID, projectName, projectDescription, startDate, endDate, fundGoal], (err, data) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (req.files && req.files.length > 0) {
//             const imageSQL = "INSERT INTO project_images (projectID, imageURL) VALUES ?";
//             const imageValues = req.files.map(file => [projectID, file.filename]);
      
//             db.query(imageSQL, [imageValues], (imageErr) => {
//               if (imageErr) return res.status(500).json(imageErr);
//             });
//           }
//         return res.status(201).json({ message: "Project added successfully" });
//     });
// });

// app.post('/update_project', (req, res) => {
//     const { projectID, categoryID, projectName, projectDescription, startDate, endDate, fundGoal, fundAmount } = req.body;
    
//     const sql = `
//         UPDATE projects
//         SET categoryID = ?, projectName = ?, projectDescription = ?, startDate = ?, endDate = ?, fundGoal = ?, fundAmount = ?
//         WHERE projectID = ?;
//     `;
//     db.query(sql, [categoryID, projectName, projectDescription, startDate, endDate, fundGoal, fundAmount, projectID], (err, data) => {
//         console.log(err);
//         if (err) return res.status(500).json({ error: err.message });
//         if (data.affectedRows === 0) {
//             return res.status(404).json({ message: "Project not found" });
//         }
//         return res.status(200).json({ message: "Project updated successfully" });
//     });
// });

// app.post('/delete_projects', (req, res) => {
//     const { projectID } = req.body; // Extract projectID from request body
    
//     // SQL query to delete the project
//     const sql = "DELETE FROM projects WHERE projectID = ?;";
    
//     // Execute the query
//     db.query(sql, [projectID], (err, data) => {
//         if (err) {
//             console.error("Error deleting project:", err);
//             return res.status(500).json(err);
//         }
        
//         if (data.affectedRows === 0) {
//             return res.status(404).json({ message: "Project not found" });
//         }
        
//         return res.status(200).json({ message: "Project deleted successfully" });
//     });
// });

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
    
//     const sql = "SELECT * FROM users WHERE Username = ? AND Password = ?;";
//     db.query(sql, [username, password], (err, data) => {
//         if (err) return res.status(500).json(err);
        
//         return res.status(200).json(data);
//     });
// });

const jwt = require('jsonwebtoken');
const secretKey = "your_jwt_secret_key"; // You should keep this in an environment variable

// User login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const sql = "SELECT * FROM users WHERE Username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        
        const user = result[0];
        
        // Compare the entered password with the hashed password stored in the database
        const passwordIsValid = password === user.Password;
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: 86400 // Token expires in 24 hours
        });
        
        return res.status(200).json({
            message: 'Login successful',
            userID: user.ID,
            token: token // Send the token back to the client
        });
    });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided.' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });
        // If the token is valid, save the decoded user ID for future use
        req.userId = decoded.id;
        next();
    });
}

// Protect a route by applying the middleware
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route.' });
});

app.listen(8081, () => {
    console.log("Listening");
})

