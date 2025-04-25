CREATE TABLE IF NOT EXISTS "serverUsers" (
	"id" varchar(256) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "voiceChatBan" (
	"id" varchar(256) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "voiceChatBan" ADD CONSTRAINT "voiceChatBan_id_serverUsers_id_fk" FOREIGN KEY ("id") REFERENCES "public"."serverUsers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
