ALTER TABLE "plays" ADD COLUMN "puntos" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "puntos";