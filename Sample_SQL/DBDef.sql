
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS leagues,
                      users,
                      maps,
                      matches,
                      teams,
                      teams_users,
			     matches_teams,
			     leagues_teams;

CREATE TABLE maps (
	map_id INT NOT NULL AUTO_INCREMENT,
	map_name VARCHAR(31) NOT NULL,
	map_photo BLOB,
	PRIMARY KEY(map_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE leagues(
	league_id INT NOT NULL AUTO_INCREMENT,
	league_name VARCHAR(31),
	season_numb INT NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE,
	PRIMARY KEY (league_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE matches (
	match_id INT NOT NULL AUTO_INCREMENT,
	team1_id INT NOT NULL,
	team2_id INT NOT NULL,
	team1_score INT,
	team2_score INT,
	match_type ENUM('Rainmaker', 'Splat Zones', 'Clam Blitz', 'Tower Control'),
	league_id INT NOT NULL,
	match_date DATE,
	map_id INT,
	PRIMARY KEY (match_id),
    FOREIGN KEY(map_id) REFERENCES maps (map_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(team1_id) REFERENCES teams (team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(team2_id) REFERENCES teams (team_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(league_id) REFERENCES leagues(league_id) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
     
CREATE TABLE teams (
  team_id INT NOT NULL AUTO_INCREMENT,
  team_name VARCHAR(20) NOT NULL,
  description VARCHAR(509),
  team_photo BLOB,
  PRIMARY KEY (team_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

  
CREATE TABLE users (
  user_id INT AUTO_INCREMENT NOT NULL,
  user_name VARCHAR(20) NOT NULL UNIQUE,
  user_photo BLOB,
  email VARCHAR(255) UNIQUE NOT NULL,
  PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE teams_users (
  user_id INT NOT NULL,
  team_id INT NOT NULL,
  join_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  leave_date DATETIME,
  FOREIGN KEY( user_id ) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY( team_id ) REFERENCES teams (team_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (user_id, team_id, join_date)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE leagues_teams (
	league_id INT NOT NULL,
	team_id INT NOT NULL,
	FOREIGN KEY( league_id ) REFERENCES leagues(league_id)
	FOREIGN KEY( team_id) REFERENCES teams(team_id),
	PRIMARY KEY(league_id, team_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE matches_teams(
	match_id INT NOT NULL,
	team_id INT NOT NULL,
	FOREIGN KEY( match_id ) REFERENCES matches(match_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY( team_id ) REFERENCES teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY( match_id, team_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

	
