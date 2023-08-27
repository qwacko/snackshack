CREATE TABLE `order_line` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`week_id` text NOT NULL,
	`snack_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`week_id`) REFERENCES `week`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`snack_id`) REFERENCES `week_options`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `snack` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`snack_group_id` text NOT NULL,
	`priceCents` integer NOT NULL,
	`max_quantity` integer,
	`image_filename` text,
	`sale_percentage` integer DEFAULT 0 NOT NULL,
	`sale_price` integer NOT NULL,
	`availablePercentage` integer DEFAULT 100 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`snack_group_id`) REFERENCES `snack_group`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `snack_group` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`limit` integer
);
--> statement-breakpoint
CREATE TABLE `week` (
	`id` text PRIMARY KEY NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `week_options` (
	`id` text PRIMARY KEY NOT NULL,
	`week_id` text NOT NULL,
	`snack_id` text NOT NULL,
	`priceCents` integer NOT NULL,
	FOREIGN KEY (`week_id`) REFERENCES `week`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`snack_id`) REFERENCES `snack`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `order_week_idx` ON `order_line` (`week_id`);--> statement-breakpoint
CREATE INDEX `order_snack_idx` ON `order_line` (`snack_id`);--> statement-breakpoint
CREATE INDEX `order_user_idx` ON `order_line` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `snack_title_unique` ON `snack` (`title`);--> statement-breakpoint
CREATE INDEX `snack_group_idx` ON `snack` (`snack_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `snack_group_title_unique` ON `snack_group` (`title`);--> statement-breakpoint
CREATE INDEX `option_week_idx` ON `week_options` (`week_id`);--> statement-breakpoint
CREATE INDEX `option_snack_idx` ON `week_options` (`snack_id`);