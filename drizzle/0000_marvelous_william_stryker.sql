CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`project` text NOT NULL,
	`ownership` text NOT NULL,
	`purpose` text NOT NULL,
	`visit_date` text DEFAULT '' NOT NULL,
	`contact_time` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`source` text NOT NULL,
	`consent_version` text NOT NULL,
	`created_at` integer NOT NULL
);
