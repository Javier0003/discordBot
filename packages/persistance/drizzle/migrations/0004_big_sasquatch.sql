ALTER TABLE "plays" RENAME COLUMN "uid" TO "uId";--> statement-breakpoint
ALTER TABLE "plays" DROP CONSTRAINT "plays_uid_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plays" ADD CONSTRAINT "plays_uId_users_id_fk" FOREIGN KEY ("uId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
