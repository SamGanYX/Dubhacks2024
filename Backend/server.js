const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const multer = require('multer');
const path = require('path');

const { calculateDiet, adjustDiet } = require('./src/dietCalculator');

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

app.get('/userstats', (req, res) => {
    const sql = "SELECT * FROM userstats;"
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

// =============== Adding to Table ================ \\


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

app.post('/userstats', (req, res) => {
    const { userID, age, height, weight, gender, goal, activity } = req.body;
    // Ensure required fields are provided
    if (!userID || !height || !weight || !goal || !activity) {
        return res.status(400).json({ error: 'All fields are required' });
    }
  
    // Insert the data into UserStats table
    const query = `
        INSERT INTO UserStats (UserID, age, Gender, Weight, Height, Goal, Activity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [userID, age, gender, weight, height, goal, parseFloat(activity)], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
    
        res.status(201).json({ message: 'User stats added successfully', results });
    });
});

// ========================= Auth ====================== \\

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

app.post('/api/calculate-diet', async (req, res) => {
    const { targetWeight, targetTime, userID } = req.body; // Ensure userID is included in the request body

    // Query to fetch user stats based on userID
    const sql = "SELECT height, gender, weight, age, activity FROM UserStats WHERE userID = ?";
    
    db.query(sql, [userID], (err, results) => {
        if (err) return res.status(500).json({ error: err.message }); // Handle SQL errors
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' }); // Handle case when user not found
        }

        const { height, gender, weight, age, activity } = results[0]; // Extract data from the first row
        try {
            const dietResult = calculateDiet(height, gender, weight, age, targetWeight, targetTime, activity); // Call the diet calculation function
            return res.status(200).json(dietResult); // Respond with the diet result
        } catch (error) {
            return res.status(500).json({ error: error.message }); // Handle calculation errors
        }
    });
});

// Protect a route by applying the middleware
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route.' });
});

app.listen(8081, () => {
    console.log("Listening");
})

