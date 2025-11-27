CREATE TABLE `fruits` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `origin` varchar(191) DEFAULT NULL,
  `price_per_kg` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fruits` (`id`, `name`, `description`, `quantity`, `image`, `origin`, `price_per_kg`) VALUES
(1, 'Apple', 'Fresh red apples', 120, 'https://m.media-amazon.com/images/I/51Xcc-0hDRL.jpg', 'USA', 150.00),
(2, 'Banana', 'Ripe yellow bananas', 200, 'https://fruitguys.com/wp-content/uploads/2015/01/bananas-pile-bigstock-168094529-XL.jpg', 'Thailand', 35.00),
(3, 'Orange', 'Sweet oranges', 180, 'https://www.allrecipes.com/thmb/y_uvjwXWAuD6T0RxaS19jFvZyFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1205638014-2000-d0fbf9170f2d43eeb046f56eec65319c.jpg', 'Spain', 80.00),
(4, 'Mango', 'Golden ripe mangoes', 90, 'https://thumbs.dreamstime.com/b/ripe-golden-mangos-leaf-dark-background-110807011.jpg', 'Thailand', 60.00),
(5, 'Grapes', 'Seedless green grapes', 75, 'https://resources.markon.com/sites/default/files/styles/large/public/pi_photos/Grapes_Green_Hero.jpg', 'Australia', 120.00),
(6, 'Watermelon', 'Large sweet watermelons', 40, 'https://www.reviewpromote.com/images/img_post/post_20170330144155.jpg', 'Thailand', 25.00);

ALTER TABLE `fruits`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `fruits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
