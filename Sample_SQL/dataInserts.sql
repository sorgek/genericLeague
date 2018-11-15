INSERT into maps (map_name) VALUES ('Urchin Underpass'), ('Walleye Warehouse'), ('Starfish Mainstage'), ('Humpback Pump Track');

INSERT into leagues(league_name, season_numb, start_date, end_date) VALUES ('Invite', 1, '2018-10-01', '2018-12-20'), ('Open', 1, '2018-10-01', '2018-12-20');

INSERT into users (user_name, email) VALUES ('gabe', 'gabe@hi.com'), ('Latias', 'latias@hi.com'), ('River', 'river@hi.com'), ('flc', 'flc@hi.com');

INSERT into teams(team_name, description) VALUES('Team Australia','Theyre from Australia'), ('Team Quaker Oats', 'Delicious, cinnamon-y');

INSERT into matches(team1_id, team2_id, league_id, map_id, team1_score, team2_score, match_type) VALUES (1, 2, 1, 3, 5, 8, 2), (2, 1, 1, 1, 4, 6, 3);

INSERT into matches_teams(match_id,  team_id) VALUES (1,2), (1,1);

INSERT into leagues_teams(league_id, team_id) VALUES( 1,1),(1,2);

INSERT into teams_users(user_id, team_id) VALUES (1,1), (2,1), (3,2), (4,2);

SELECT * from users;

SELECT * from teams;

SELECT * from leagues;

SELECT * from matches;
	
