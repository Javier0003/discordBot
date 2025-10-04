ALTER TABLE "botStatus" RENAME COLUMN "idStatus" TO "id";--> statement-breakpoint
ALTER TABLE "botStatus" ALTER COLUMN "statusMessage" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "botStatus" ALTER COLUMN "type" SET NOT NULL;