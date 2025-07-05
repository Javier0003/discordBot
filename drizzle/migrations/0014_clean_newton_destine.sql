CREATE TABLE IF NOT EXISTS "botStatus" (
	"idStatus" serial PRIMARY KEY NOT NULL,
	"statusMessage" varchar(256),
	"type" integer,
	"url" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"idMessage" serial PRIMARY KEY NOT NULL,
	"message" varchar(256)
);
