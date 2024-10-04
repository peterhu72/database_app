
# NBA Database

**NBA Database** is an interface designed to answer questions about players, teams, and stats in the NBA.

## Overview

The `six_questions.json` file includes six example questions that demonstrate the types of queries this interface can answer.

![NBA Database Interface](https://github.com/user-attachments/assets/04a0fb4d-785d-4a45-9b85-ee8780b85dac)

## Example Queries

### Successful Query

- **Question:**  
  Show all game statistics for players on the Lakers.

- **Generated SQL Query:**
  ```sql
  SELECT * 
  FROM players
  JOIN teams ON players.team_id = teams.team_id
  JOIN game_stats ON players.player_id = game_stats.player_id
  WHERE teams.team_name = 'Lakers';
  ```

- **Result:**
  ```json
  [
      {
          "stat_id": 1,
          "player_id": 1,
          "game_date": "2024-10-01T06:00:00.000Z",
          "points": 30,
          "assists": 7,
          "rebounds": 10,
          "first_name": "LeBron",
          "last_name": "James",
          "position": "Forward",
          "height_cm": 206,
          "weight_kg": 113.4,
          "team_id": 1,
          "team_name": "Lakers",
          "city": "Los Angeles",
          "abbreviation": "LAL"
      },
      {
          "stat_id": 2,
          "player_id": 2,
          "game_date": "2024-10-01T06:00:00.000Z",
          "points": 20,
          "assists": 3,
          "rebounds": 12,
          "first_name": "Anthony",
          "last_name": "Davis",
          "position": "Center",
          "height_cm": 208,
          "weight_kg": 115.2,
          "team_id": 1,
          "team_name": "Lakers",
          "city": "Los Angeles",
          "abbreviation": "LAL"
      }
  ]
  ```

- **Friendly Answer:**  
  *Check it out, we've got a dynamic duo from the Lakers on the court!* 🏀 LeBron "The King" James, towering at **206 cm and 113.4 kg**, led with *30 points, 7 assists, and 10 rebounds*. Anthony Davis, a dominant Center at **208 cm and 115.2 kg**, followed with *20 points, 3 assists, and 12 rebounds*. This power pair keeps LA's basketball dreams alive! 🌟 #LakeShow #NBAlegends

---

### Unsuccessful Query

- **Question:**  
  Who scored the most points in a single game?

- **Generated SQL Query:**
  ```sql
  SELECT player_id, MAX(points) AS max_points
  FROM game_stats;
  ```

- **Error Explanation:**  
  The SQL statement produced an error due to the absence of a `GROUP BY` clause.

---

## Strategy Comparison

- **Zero-Shot Prompting:**  
  Zero-shot prompting consistently generated successful queries, showcasing flexibility in handling various questions.
  
- **One-Shot and Multi-Shot Prompting:**  
  One-shot and multi-shot prompting worked well in certain cases but encountered SQL errors with more complex queries.
