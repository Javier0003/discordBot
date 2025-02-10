ALTER TABLE "mapas" ADD COLUMN "order" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "mapas" DROP COLUMN IF EXISTS "id";