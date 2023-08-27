CREATE TABLE `user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`admin` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_line` (
	`id` text PRIMARY KEY NOT NULL,
	`user_order_config_id` text NOT NULL,
	`week_id` text NOT NULL,
	`snack_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`submitted` integer DEFAULT false NOT NULL,
	`purchased` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_order_config_id`) REFERENCES `user_order_config`(`id`) ON UPDATE no action ON DELETE no action,
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
	`override_group_limit` integer DEFAULT false NOT NULL,
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
CREATE TABLE `user_order_config` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
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
	`special` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`week_id`) REFERENCES `week`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`snack_id`) REFERENCES `snack`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE INDEX `order_week_idx` ON `order_line` (`week_id`);--> statement-breakpoint
CREATE INDEX `order_snack_idx` ON `order_line` (`snack_id`);--> statement-breakpoint
CREATE INDEX `order_user_idx` ON `order_line` (`user_order_config_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `snack_title_unique` ON `snack` (`title`);--> statement-breakpoint
CREATE INDEX `snack_group_idx` ON `snack` (`snack_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `snack_group_title_unique` ON `snack_group` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_order_config_user_id_unique` ON `user_order_config` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_order_config_user_idx` ON `user_order_config` (`user_id`);--> statement-breakpoint
CREATE INDEX `option_week_idx` ON `week_options` (`week_id`);--> statement-breakpoint
CREATE INDEX `option_snack_idx` ON `week_options` (`snack_id`);