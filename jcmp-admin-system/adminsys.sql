CREATE TABLE IF NOT EXISTS admins(
    steamid varchar(17) not null,
    name varchar(40) not null,
    rank int not null,
    PRIMARY KEY(steamId)
) ENGINE=MyISAM;
CREATE TABLE IF NOT EXISTS banlist(
    steamid varchar(17) not null,
    name varchar(40) not null,
    reason text,
    date_start int not null,
    date_end int not null,
    bannedby_steamId int not null,
    bannedby_name varchar(40) not null,
    PRIMARY KEY(steamId)
) ENGINE=MyISAM;