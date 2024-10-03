const express = require('express');
const mysql = require('mysql');
const OpenAI = require('openai'); // Import OpenAI directly
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Initialize OpenAI client directly using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from .env
});


// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: process.env.PASSWORD, // Replace with your MySQL password
    database: 'nba', // Replace with your database name
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to handle queries
app.post('/query', async (req, res) => {
    const { question } = req.body;

    console.log(question)

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        // Ask GPT-3 to generate an SQL query based on the user's question
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Convert the following natural language question into a SQL query for a database containing NBA players' information:\n\n"${question}"\n\nSQL query:`,
            max_tokens: 100,
        });

        const sqlQuery = gptResponse.data.choices[0].text.trim();
        console.log('Generated SQL Query:', sqlQuery);

        // Execute the SQL query on the MySQL database
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Error executing SQL query' });
            }

            // Return the result to the frontend
            res.json(result);
        });

    } catch (error) {
        console.error('Error interacting with GPT-3:', error);
        res.status(500).json({ error: 'Error processing the query' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
