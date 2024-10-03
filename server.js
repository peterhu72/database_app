const express = require('express');
const mysql = require('mysql');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS middleware
dotenv.config();

const app = express();
const port = 3000;

// Enable CORS for all origins or specific origin (you can change it to your specific frontend domain)
app.use(cors({
    origin: '*' // This allows all origins. For security, you can specify a particular origin, like 'http://127.0.0.1:5500'
}));

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
  
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
  
    try {
      // Interact with GPT-3 to generate SQL based on the user's question
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant that generates SQL queries, and nothing else.' },
          { role: 'user', content: `Convert this question into an SQL query: "${question}". Do not include anything other than the SQL query.` },
        ],
        max_tokens: 100,
      });
  
      // Extract the generated SQL query from the OpenAI response
      let sqlQuery = response.choices[0].message.content.trim();
      sqlQuery = sqlQuery.replace(/[^a-zA-Z0-9_*,.\s=<>\'\"()\n]/g, ''); // Clean non-SQL characters
      console.log('Generated SQL Query:', sqlQuery);
  
      // Execute the SQL query on the MySQL database
      db.query(sqlQuery, async (err, result) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.status(500).json({ error: 'Error executing SQL query' });
        }
  
        // SQL query result is obtained, now send this result back to GPT-3 for a "cool explanation"
        const resultJson = JSON.stringify(result);
        const explanationResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an assistant that creates cool explanations of data in JSON format.' },
            { role: 'user', content: `Explain the following JSON data in a cool way: ${resultJson}` },
          ],
          max_tokens: 300,
        });
  
        // Extract the cool explanation from the OpenAI response
        const coolExplanation = explanationResponse.choices[0].message.content.trim();
        console.log('Generated Explanation:', coolExplanation);
  
        // Return the explanation to the client
        res.json({ explanation: coolExplanation, data: result });
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
