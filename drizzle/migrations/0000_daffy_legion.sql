CREATE TABLE IF NOT EXISTS "mapa" (
	"oldMaps" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"completados" integer DEFAULT 0,
	"osuId" integer NOT NULL
);
