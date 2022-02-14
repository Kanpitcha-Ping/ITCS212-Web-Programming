-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 14, 2019 at 11:08 AM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teaory`
--
CREATE DATABASE IF NOT EXISTS `teaory` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `teaory`;

-- ------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS UserInfo (
	user_id			bigint(9)		NOT NULL	PRIMARY KEY,
    user_fname 	  	nvarchar(50) 	NOT NULL,
	user_lname 	  	nvarchar(50) 	NOT NULL,
    user_phone 		nvarchar(10) 	NOT NULL,
    user_email		nvarchar(100)	NOT NULL,
    user_address  	nvarchar(100)   ,          
    user_prefer	  	nvarchar(500)
);

CREATE TABLE IF NOT EXISTS LoginInfo (
    login_user    	nvarchar(20)    NOT NULL  PRIMARY KEY,
    login_pwd		nvarchar(32)	NOT NULL,
    login_role    	char(1)         NOT NULL,
    login_time   	datetime 		NOT NULL,
    user_id       	bigint(9)       NOT NULL,
    CONSTRAINT    	FK_LogUser      FOREIGN KEY (user_id)   REFERENCES UserInfo(user_id),
    CONSTRAINT    	CHK_login_role  CHECK (login_role IN ('C','A')) -- customer and admin
);  

CREATE TABLE IF NOT EXISTS TypeTea (
    tt_id         tinyint(1)      NOT NULL  PRIMARY KEY,
    tt_name       nvarchar(20)    NOT NULL,
    tt_img        TEXT(100),
    tt_header	  TEXT(500),
    tt_des		  TEXT(500),
    tt_making     TEXT(500)
); 
/*
ALTER TABLE TypeTea
ADD tt_header	  TEXT(500),
ADD tt_des		  TEXT(500),
ADD tt_making     TEXT(500);
*/

CREATE TABLE IF NOT EXISTS Product (
    prod_id       	bigint(9)       NOT NULL   PRIMARY KEY,
    prod_name   	nvarchar(50)    NOT NULL,
    prod_status   	char(1)         NOT NULL,
    prod_des      	TEXT(500),
    tt_id         	tinyint(1)      NOT NULL,
    CONSTRAINT    	FK_typTea_prod  FOREIGN KEY (tt_id)   REFERENCES TypeTea(tt_id),
    CONSTRAINT    CHK_prod_status  CHECK (prod_status IN ('A','U')) -- Available and Unavailable
);   

CREATE TABLE IF NOT EXISTS Product_details (
    prod_id       	bigint(9) 	    NOT NULL, 
    prod_price      decimal(12,2)   NOT NULL,
    prod_unit       nvarchar(20)    NOT NULL,
    prod_logo       TEXT(100),
    prod_img1       TEXT(100),
    prod_img2       TEXT(100),
    CONSTRAINT    FK_prod_detail   FOREIGN KEY (prod_id)   REFERENCES Product(prod_id)
);

CREATE TABLE IF NOT EXISTS Delivery (
    deli_id       	bigint(9) 	  	NOT NULL  PRIMARY KEY,
    deli_status   	char(1)         NOT NULL,
    deli_des      	nvarchar(500),
    user_id			bigint(9)       NOT NULL,
    CONSTRAINT    FK_DeliUser       FOREIGN KEY (user_id)   REFERENCES UserInfo(user_id),
    CONSTRAINT    CHK_deli_status  CHECK (deli_status IN ('A','N')) -- arrived and not arrived
);

CREATE TABLE IF NOT EXISTS AddCart (
    user_id       bigint(9)       NOT NULL,
    prod_id       bigint(9)       NOT NULL,
    ac_time       DATE,
    ac_quantity   tinyint,
    CONSTRAINT    FK_CartUser       FOREIGN KEY (user_id)     REFERENCES UserInfo(user_id),
    CONSTRAINT    FK_CartBrand      FOREIGN KEY (prod_id)     REFERENCES Product(prod_id),
    PRIMARY KEY (user_id, prod_id)
);

CREATE TABLE IF NOT EXISTS Purchase_order (
    po_id         bigint(9)        	NOT NULL  PRIMARY KEY,
    po_date       date            	NOT NULL,
    po_ship       nvarchar(100)   	NOT NULL,
    po_note       nvarchar(100),
    po_discount   decimal(5,2), 
    po_deldate    date            	NOT NULL,
    po_shipcost   decimal(12,2),
    po_tax        decimal(5,2),
    user_id       bigint(9)       	NOT NULL,
    prod_id       bigint(9)       	NOT NULL,
    CONSTRAINT    FK_PoUser 		FOREIGN KEY (user_id) 	REFERENCES UserInfo(user_id),
    CONSTRAINT    FK_PoBrand 		FOREIGN KEY (prod_id) 	REFERENCES Product(prod_id),
    CONSTRAINT    CHK_po_tax 		CHECK (po_tax >= 0.00 AND po_tax <= 100.00),
    CONSTRAINT    CHK_po_discount 	CHECK (po_discount >= 0.00 AND po_discount <= 100.00)
);

-- ---------------------------- INSERT 7 IN EACH TABLE ----------------------------------------------

INSERT INTO UserInfo (user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer) VALUES 
(100000001, 'Mintthy', 'InwZaaa', '0916865811', 'Mintthy@gmail.com', '1/11 Sathon Rd, Bkk 10120', 'Rose tea'),
(100000002, 'jaojam', 'eiei', '0956248545', 'jaojam@gmail.com', '59/52 Yaowarat road Bangkok 10110', 'Lavender tea'),
(100000003, 'kanpizza', 'hiwaa', '0963285964', 'kanpizza@gmail.com', '206 Khao San road Bangkok 10200', 'Marigold tea'),
(100000004, 'aaimmm', 'heyyyy', '0975842659', 'aaimmm@gmail.com', '1027 Phloen Chit road Bangkok 10330', 'Jasmine tea'),
(100000005, 'Iloveshabu', 'buffet', '0945123486', 'Iloveshabu@gmail.com', '99/99 Chaengwattana road Nonthaburi 11120','Chamomile tea'),
(100000006, 'Ilovesalmon', 'luvvv', '0926359425', 'Ilovesalmon@gmail.com', '1/129 Mittraphap road Khon Kaen 40000', 'Sacred lotus tea'),
(100000007, 'Igonnasleep', 'sleepy', '0986485425', 'Igonnasleep@gmail.com', '1518 Kanjanavanich road Songkhla 90110', 'Chrysanthemum tea');

INSERT INTO LoginInfo(login_user, login_pwd, login_role, login_time, user_id) VALUES 
('Mintthy_Inw', 'mint1234', 'A', '2021-01-04 02:21:09', 100000001),
('jaojam_eie', 'jam1234', 'A', '2021-03-07 10:16:57', 100000002),
('kanpizza_hiw', 'ping1234', 'A', '2021-02-01 01:28:15', 100000003), 
('aaimmm_hey', 'aim1234', 'A', '2021-04-05 09:46:33', 100000004), 
('Iloveshabu_buf', 'shabu1234', 'C', '2021-04-10 05:06:40', 100000005),
('Ilovesalmon_luv', 'salmon1234', 'C', '2021-03-19 09:47:51', 100000006),
('Igonnasleep_sle', 'sleep1234', 'C', '2020-05-07 07:20:20', 100000007);

INSERT INTO TypeTea(tt_id, tt_name, tt_img, tt_header, tt_des, tt_making) VALUES
(1, 'Rose tea', 'images/rose_all.png', 'TEAORY’s Rose Tea (n.) tea of desired love.', 'The rose tea is a widely famous flower tea nowadays due to its beautiful color and its sweet fragrance. Including the properties that equal the customer’s needs. Our rose tea is a best seller which is our signature tea. Just drinking a cup of Teaory’s rose tea will help to relieve stress. It soothes the body and mind by taking time to indulge in the sweet. Rose tea maintains a healthy heart, contains antioxidants, and nourishes the skin to make it brighter.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass, pour hot water over it, pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-90 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight.'),
(2, 'Chrysanthemum tea', 'images/chrysanthemum_all.png', 'TEAORY’s Chrysanthemum Tea (n.) tea of devoted love.', 'Teaory’s chrysanthemum tea has a unique fragrance and soft taste. It is suitable for sipping a cup in the afternoon with a slice of bread. Chrysanthemum tea has properties to help quench thirst, nourish the heart, and build immunity to the body. It also treats the respiratory and digestive system. Including, life extension. Anyone who likes the scent and soft taste of chrysanthemum flowers. Don’t forget to come and try our tea.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight.'),
(3, 'Jasmine tea', 'images/jasmine_all.png', 'TEAORY’s Jasmine tea (n.) tea of innocent love.', 'Teaory’s Jasmine tea has a delight sense with a sweet aroma and blossom that relieves fatigue and heart burnt thrist. Also, stimulate the heart function, control blood pressure, help with sleeping deeply, soothe the stomach ache and chronic wounds. Jasmine tea also contains some vitamins and minerals that come from green tea leaves.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight.'),
(4, 'Sacred lotus tea', 'images/lotus_all.png', 'TEAORY’s Sacred lotus tea (n.) Tea of falling in love again.', 'Our innovative menu that we would like to present is Teaory’s Sacred lotus tea. The lotus petals have high antioxidants. The sacred lotus tea is outstanding in terms of inhibiting the blood, allowing the blood flow fluently, and helping the body rejuvenate. Moreover, it nourishes blood, heart, kidney, and pregnancy. Our tea can reduce blood fat, prevent infection, and increase immunity. If you want to be in love, you should come and try one.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight'),
(5, 'Marigold tea', 'images/marigold_all.png','TEAORY’s Marigold tea (n.) tea of romantic love.', 'We are proud to present the Teaory’s Marigold tea which has an interesting clear color. Our Marigold flowers tend to transform into tea with the full benefits. Our tea is full-filled with the beta carotene and lutein which help to nourish your eyes. It also treats various inflammation and improves freshness from stressful conditions. Therefore, we really recommend Teaory’s Marigold tea if you want to rest your heart.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight'),
(6, 'Lavender tea', 'images/lavender_all.png', 'TEAORY’s Lavender tea (n.) tea of love at first sight.', 'The Lavender flower is famous in terms of light fragrance. It tends to transform into many products. When it is in the form of tea, there is a relaxing fragrance. The properties of lavender tea help to calm the brain, nourish the brain for good memory, and digest the system to work better. Furthermore, It also helps to relieve stress from fatigue, make sleep more comfortable, and not be lost to jasmine at all. If you want to fall in love with it, Teaory’s Lavender tea is ready to serve.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight'),
(7, 'Osmanthus tea', 'images/osmanthus_all.png', 'TEAORY’s Osmanthus tea (n.) tea of faithfulness love.', 'Osmanthus flower is an eternal immortal flower that smells as far as the wind up to ten thousand li. It has an unique and Thai style scent. Its properties are helping nourish the lungs, reducing cholesterol, fat in the blood, and symptoms of bad breath. Moreover, It also helps to prevent tooth decay, some cancers and heart disease, and eliminate toxins in the body. This flower is full of benefits which can relax your health and mind. If you want to take care of yourself, you should try Teaory’s Osmanthus flower tea.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight'),
(8, 'Chamomile tea', 'images/chamomile_all.png', 'TEAORY’s Chamomile tea (n.) tea of personifies love.', 'Chamomile tea has gentle notes of crisp apple taste and also has a light taste and floral, some people enjoy it by adding the honey and other transforming flavor. The property of chamomile tea is to promote relaxation, relieve anxiety. Furthermore it prevents cancer by the antioxidant from tea leaves and treats the digestive system.', 'Pour hot water to scald a teacup for maintaining the temperature of teacup. Then, add 3-5 grams of flowers or ⅓ of glass and pour hot water over it and pour it out immediately to activate the tea to smell faster. Then, pour hot water into the pot about 200-300 ml at 80-100 degrees and leave the tea for 1-2 minutes. When the time is over, you can sieve the flowers and drink the tea. Flower tea can be rebrewed 2-3 times but it should not be left overnight');


INSERT INTO Product(prod_id, prod_name, prod_status, prod_des, tt_id) VALUES
(100000001, 'Twinings', 'A', 'China tea with the sweet & subtle scent of rose. Black Tea, Rose Petals (10%), Rose Flavouring (3%). TWININGS have discontinued this tea, these are the last boxes', 1),
(100000002, 'Yogi tea', 'U', 'Ingredients are certified organic. Raises your energies, lifts your spirits. Highest quality ingredients.', 1),
(100000003, 'Dilmah', 'A', 'natural product Dilmah green tea with natural jasmine petals individual foil wrapped. Quality product', 3),
(100000004, 'Tazo', 'A', '100% natural ingredients includes decaffeinated green teas and lotus flower flavoring', 4), 
(100000005, 'TerraVita', 'U', 'Marigold flowers were believed to be useful in reducing inflammation, wound repairing, and as an antiseptic. Historically, Marigold was used to help support various skin problems, ranging.', 5),
(100000006, 'Ten Ren', 'A', "Ten Ren's chrysanthemum tea is a blend of chrysanthemum flowers and black tea. It is one of Ten Ren's most naturally sweet tasting products. When brewed, it produces a light brown color, a strong citrus-like aroma, strong sweet taste. Water at boiling temperature should be used for steeping. Available in boxes of 20 bags, easy to carry in daily life.", 2),
(100000007, 'Cha Wu', 'A', "Packing: Independent aluminum film bag for every Tea Bags.8 Tea Bags a Box, 2 Box a set. Taste: Osmanthus aroma and Tieguanyin smooth sweet taste,no much bitter, if you want strong taste must soak more long time Ingredient: Osmanthus Flower & Light Roasting TieGuanYin Spring Oolong Tea", 7),
(100000008, 'Lipton', 'U', "Made from natural ingredients 100% natural and Caffeine-free. No add preservatives or colorings. Smooth and calming chamomile flavor.", 8),
(100000009, 'Gryphon', 'U', 'This blend of high grown Ceylonese Black tea delicately fused with oil of lavender to create an Earl Grey tea with finesse. Before you hit the sheets tonight, allow yourself some quality alone time make a pot and grab your favourite read.Great taste and Quality product.', 6),
(100000010, 'Traditional Medicinals', 'A', null, 8);

INSERT INTO Product_details(prod_id, prod_price, prod_unit, prod_logo, prod_img1, prod_img2) VALUES
(100000001, '400.00', 'box', 'images/Twinings logo.png', 'images/rose1.png', 'images/rose2.png'),
(100000004, '150.00', 'bag', 'images/Tazo_logo.png', 'images/Sacred Lotus tea1.png', 'images/Sacred Lotus tea3.png'),
(100000002, '250.00', 'box', 'images/yogi logo.png', 'images/yogi rose tea1.png', 'images/yogi rose tea2.png'),
(100000003, '360.00', 'bag', 'images/dilmah logo.png', 'images/jasmine tea1.png', 'images/jasmine tea3.png'),
(100000010, '220.00', 'bag', null, null, null),
(100000005, '280.00', 'bag', 'images/terravitta logo.png', 'images/marigold tea1.jpg', 'images/marigold tea2.jpg'),
(100000006, '420.00', 'box', 'images/ten ren logo.png', 'images/Chrysanthemum tea1.png', 'images/Chrysanthemum tea2.png'),
(100000009, '500.00', 'box', 'images/gryphon logo.png', 'images/Lavender tea1.png', 'images/Lavender tea2.png'),
(100000007, '250.00', 'bag', 'images/chu wu logo.png', 'images/Osmanthus tea2.png', 'images/Osmanthus tea3.png'),
(100000008, '350.00', 'box', 'images/lipton logo.png', 'images/chamomile tea1.png', 'images/chamomile tea2.png');

INSERT INTO Delivery(deli_id, deli_status, deli_des, user_id) VALUES
(200000001, 'A', null, 100000003),
(200000002, 'N', 'Flash', 100000002),
(200000003, 'N', null, 100000006),
(200000004, 'A', null, 100000003),
(200000005, 'N', 'FedEx', 100000001),
(200000006, 'A', 'Kerry', 100000005),
(200000007, 'A', null, 100000007),
(200000008, 'A', 'Kerry', 100000004),
(200000009, 'N', 'JT express', 100000005),
(200000010, 'A', null, 100000006);

INSERT INTO Addcart(user_id,  prod_id, ac_time, ac_quantity) VALUES
(100000001, 100000005, '2021-03-26', 2),
(100000002, 100000003, '2021-04-05', 1),
(100000003, 100000006, '2021-04-04', 5),
(100000003, 100000010, '2021-04-10', 2),
(100000004, 100000001, '2021-02-13', 1),
(100000005, 100000004, '2021-04-07', 3),
(100000005, 100000009, '2021-04-18', 4),
(100000006, 100000007, '2021-03-25', 1),
(100000006, 100000008, '2021-04-10', 7),
(100000007, 100000001, '2021-02-16', 2);

INSERT INTO Purchase_order(po_id, po_date, po_ship, po_note, po_discount, po_deldate, po_shipcost, po_tax, user_id, prod_id) VALUES
(300000001, '2021-03-27', '2021-03-29', null, null, '2021-04-05', '30.00', '10.00', 100000001, 100000005),
(300000002, '2021-04-05', '2021-04-07', null, null, '2021-04-14', '30.00', '5.00', 100000002, 100000003),
(300000003, '2021-04-04', '2021-04-06', null, null, '2021-04-13', null, '25.00', 100000003, 100000006),
(300000004, '2021-02-14', '2021-02-16', null, null, '2021-02-23', '50.00', '5.00', 100000004, 100000001),
(300000005, '2021-04-08', '2021-04-10', null, null, '2021-04-17', '50.00', '15.00', 100000005, 100000004),
(300000006, '2021-03-26', '2021-03-28', null, null, '2021-04-04', '30.00', '5.00', 100000006, 100000007),
(300000007, '2021-02-17', '2021-02-19', null, null, '2021-02-26', '50.00', '10.00', 100000007, 100000001),
(300000008, '2021-04-10', '2021-04-12', null, null, '2021-04-19', null, '25.00', 100000003, 100000010),
(300000009, '2021-04-18', '2021-04-20', null, null, '2021-04-27', '50.00', '15.00', 100000005, 100000009),
(300000010, '2021-04-10', '2021-04-12', null, null, '2021-04-19', '30.00', '5.00', 100000006, 100000008);


-- --------------------------------------------------- SHOW EVERYTHING -------------------------------------------------------------

SELECT * FROM userinfo;

SELECT * FROM logininfo;

SELECT * FROM typetea;
DELETE FROM product WHERE prod_id = 100000011;
SELECT * FROM product;

SELECT * FROM product_details;
/*
SELECT * FROM addcart;

SELECT * FROM delivery;

SELECT * FROM purchase_order;
*/