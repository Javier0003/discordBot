CREATE TABLE IF NOT EXISTS "minecraftServers" (
	"idServer" serial PRIMARY KEY NOT NULL,
	"ip" varchar NOT NULL,
	"port" integer NOT NULL,
	"name" varchar NOT NULL
);
