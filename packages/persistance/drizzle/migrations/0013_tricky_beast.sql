DROP TABLE "devs";--> statement-breakpoint
DROP TABLE "voiceChatBan";--> statement-breakpoint
ALTER TABLE "serverUsers" ADD COLUMN "isDev" char(1) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "serverUsers" ADD COLUMN "isVCBan" char(1) DEFAULT '0';