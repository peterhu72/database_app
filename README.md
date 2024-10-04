
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


## Prompting Strategies and Observations

To retrieve insightful information from the NBA database, three main prompting strategies were employed:

1. **Zero-Shot Prompting**: Queries generated without any previous examples. This method is flexible and works well for straightforward queries where the SQL query structure is less complex.

2. **One-Shot Prompting**: Provides a single example to guide query generation. It works well for slightly complex queries, guiding the prompt toward an accurate format, though some errors may arise.

3. **Multi-Shot Prompting**: Uses multiple examples to guide query generation, making it more robust for complex SQL queries but potentially less adaptable to entirely new questions.

### Example Queries

| Strategy          | Question | SQL | Answer |
|-------------------|----------|-----|--------|
| **Zero-Shot**     | Give me all the players that are the position Guard" | `SELECT * FROM players WHERE position = 'Guard'` | Check it out, I've got some JSON data here that's all about ballers on the court! We've got Stephen Curry, the sharpshooting Guard standing at 191cm tall and weighing in at 84kg, repping Team 2. And then there's Zach LaVine, another talented Guard with a height of 196cm and a weight of 91kg, holding it down for Team 4. These guys are bringing the heat to the game, leaving defenders in the dust with their skills and finesse!
| **One-Shot**      | List the top 5 players by average points per game, along with their team name. | `SELECT p.first_name, p.last_name, t.team_name, AVG(gs.points) AS average_points_per_game FROM game_stats gs JOIN players p ON gs.player_id = p.player_id JOIN teams t ON p.team_id = t.team_id GROUP BY p.player_id, p.first_name, p.last_name, t.team_name ORDER BY average_points_per_game DESC LIMIT 5` | Check out this JSON data featuring some of the top basketball stars in the game! 🏀\n1. **Stephen Curry** is lighting up the court for the Warriors with an average of 40 points per game.\n2. **Kevin Durant** is showing his skills with the Nets, scoring an impressive average of 35 points per game.\n3. **LeBron James** is leading the Lakers with his all-star performances, averaging 30 points per game.\n4. **Zach LaVine** is shining for the Bulls with an average of 25 points per game.\n5. **Anthony Davis** is making his mark for the Lakers with an average of 20 points per game.\nThese players are bringing the heat and thrilling fans with their amazing performances on the court! 🌟🔥
| **Multi-Shot**    | Which team has the highest average points per game for their players in the 2023 season? | `SELECT teams.team_name FROM teams JOIN players ON teams.team_id = players.team_id JOIN game_stats ON players.player_id = game_stats.player_id WHERE EXTRACT(YEAR FROM game_stats.game_date) = 2023 GROUP BY teams.team_name ORDER BY AVG(game_stats.points) DESC LIMIT 1` | Empty array response, possibly due to the unmatched format expected by multi-shot example queries.|

### Observations

- **Zero-Shot Prompting** was the most flexible, handling a wide variety of questions without prior examples, making it effective for dynamic and varied questions.
- **One-Shot Prompting** sometimes encountered issues with complex queries but handled straightforward examples effectively.
- **Multi-Shot Prompting** occasionally resulted in SQL errors, especially for complex queries, as it seems to adhere strictly to the examples provided, which may limit adaptability to novel queries.
