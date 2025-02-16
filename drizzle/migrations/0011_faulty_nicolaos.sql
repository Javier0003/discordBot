CREATE TABLE IF NOT EXISTS "comments" (
	"commentId" serial PRIMARY KEY NOT NULL,
	"mapId" integer NOT NULL,
	"uId" varchar NOT NULL,
	"comment" varchar NOT NULL,
	"date" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_mapId_mapas_oldMaps_fk" FOREIGN KEY ("mapId") REFERENCES "public"."mapas"("oldMaps") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_uId_users_id_fk" FOREIGN KEY ("uId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
