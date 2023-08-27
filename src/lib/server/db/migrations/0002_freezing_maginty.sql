ALTER TABLE order_line ADD `submitted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE order_line ADD `purchased` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE snack ADD `override_group_limit` integer DEFAULT false NOT NULL;