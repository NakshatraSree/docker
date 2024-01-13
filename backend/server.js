const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: 'mysql', // Docker service name from docker-compose
  user: 'db_user',
  password: 'db_password',
  database: 'cloud',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.send('Backend Working Good!');
    }
);
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
        console.error('Error executing query', err);
        return;
        }
        res.send(rows);
    });
    }
);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, rows) => {
            if (err) {
                console.error('Error executing query', err);
                return res.status(500).send('Internal Server Error');
            }

            // Check if there are any rows returned from the query
            if (rows.length > 0) {
                // Credentials matched, send a success response
                res.status(200).send('Login successful');
            } else {
                // Credentials did not match, send an error response
                res.status(401).send('Invalid credentials');
            }
        }
    );
});

app.post('/register', (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return;
        }
        res.send(result);
        }
    );
    }
);

app.delete('/users/:email', (req, res) => {
    const { email } = req.params;
    connection.query('DELETE FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
        console.error('Error executing query', err);
        return;
        }
        res.send(result);
    });
    }
);
app.put('/users/:email', (req, res) => {
    const { name, email, pwd } = req.body;
    connection.query(
        'UPDATE users SET name = ?, pwd = ? WHERE email = ?',
        [name, pwd, email],
        (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            return;
        }
        res.send(result);
        }
    );
    }
);




// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
