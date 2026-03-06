CREATE TABLE IF NOT EXISTS "mapas" (
	"oldMaps" integer PRIMARY KEY NOT NULL,
	"oldMapMods" varchar NOT NULL,
	"oldMapMinRank" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plays" (
	"playId" serial PRIMARY KEY NOT NULL,
	"mapId" integer NOT NULL,
	"uid" varchar NOT NULL,
	"rank" varchar NOT NULL,
	"score" integer NOT NULL,
	"accuracy" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"osuId" integer NOT NULL,
	"puntos" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plays" ADD CONSTRAINT "plays_mapId_mapas_oldMaps_fk" FOREIGN KEY ("mapId") REFERENCES "public"."mapas"("oldMaps") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plays" ADD CONSTRAINT "plays_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
