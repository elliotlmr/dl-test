CREATE TABLE IF NOT EXISTS "friend_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"treated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"firstname" text,
	"lastname" text,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"friends" text[] DEFAULT '{}' NOT NULL,
	"blacklist" text[] DEFAULT '{}' NOT NULL,
	"role" text DEFAULT 'guest' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_friend_id_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
