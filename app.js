const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const connectDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Is Running");
    });
  } catch (error) {
    console.log(`DB Erroe ${error.message}`);
  }
};

connectDBAndServer();

app.get("/players/", async (request, response) => {
  const query = `select * from cricket_team
    `;
  const players = await db.all(query);
  response.send(players);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const query = `insert into cricket_team (player_name,jersey_number,role)
  values("${player_name}",${jersey_number},"${role};")
  `;
  const dbresponse = await db.run(query);
  response.send("Player Added to Team");
});
