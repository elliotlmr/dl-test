CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" text,
	"lastname" text,
	"email" text,
	"password" text
);
