CREATE TABLE IF NOT EXISTS "serverUsers" (
	"id" varchar(256),
	"isDev" char(1) DEFAULT '0',
	"isVCBan" char(1) DEFAULT '0'
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "serverUsers" ADD CONSTRAINT "serverUsers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
