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

const format = function (i) {
  return {
    playerId: i.player_id,
    playerName: i.player_name,
    jerseyNumber: i.jersey_number,
    role: i.role,
  };
};

//API 1

app.get("/players/", async (request, response) => {
  const query = `select * from cricket_team
    `;
  const players = await db.all(query);
  let lst = [];
  for (let i of players) {
    const change = format(i);
    lst.push(change);
  }
  response.send(lst);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const query = `insert into cricket_team (player_name,jersey_number,role)
  values("${playerName}",${jerseyNumber},"${role};")
  `;
  const dbresponse = await db.run(query);
  response.send("Player Added to Team");
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `select * from cricket_team where player_id=${playerId};`;
  const players = await db.get(query);
  const change = format(players);
  response.send(change);
});

module.exports = app;
