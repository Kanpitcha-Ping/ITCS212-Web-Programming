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
    user_address  	nvarchar(100)   NOT NULL,          
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
    tt_name       nvarchar(20)    NOT NULL
); 

/*
CREATE TABLE IF NOT EXISTS Brand (
    brand_id       	bigint(9)       NOT NULL   PRIMARY KEY,
    brand_brand    	nvarchar(50)    NOT NULL,
    brand_status   	char(1)         NOT NULL,
    brand_des      	nvarchar(500),
    tt_id         	tinyint(1)      NOT NULL,
    CONSTRAINT    CHK_brand_status  CHECK (brand_status IN ('A','U')) -- Available and Unavailable
);    

CREATE TABLE IF NOT EXISTS Goods (
    brand_id       bigint(9) 	  NOT NULL,
    g_price       decimal(12,2)   NOT NULL,
    g_unit        nvarchar(20)    NOT NULL,
    CONSTRAINT    FK_BrandGoods   FOREIGN KEY (brand_id)   REFERENCES Brand(brand_id)
);
*/

CREATE TABLE IF NOT EXISTS Product (
    prod_id       	bigint(9)       NOT NULL   PRIMARY KEY,
    prod_name   	nvarchar(50)    NOT NULL,
    prod_status   	char(1)         NOT NULL,
    prod_des      	nvarchar(500),
    tt_id         	tinyint(1)      NOT NULL,
    CONSTRAINT    	FK_typTea_prod  FOREIGN KEY (tt_id)   REFERENCES TypeTea(tt_id),
    CONSTRAINT    CHK_prod_status  CHECK (prod_status IN ('A','U')) -- Available and Unavailable
);   

CREATE TABLE IF NOT EXISTS Product_details (
    prod_id       	bigint(9) 	    NOT NULL, 
    prod_price      decimal(12,2)   NOT NULL,
    prod_unit       nvarchar(20)    NOT NULL,
    CONSTRAINT    FK_prod_detail   FOREIGN KEY (prod_id)   REFERENCES Product(prod_id)
);

CREATE TABLE IF NOT EXISTS Delivery (
    deli_id       	bigint(9) 	  	NOT NULL  PRIMARY KEY,
    deli_status   	char(1)         NOT NULL,
    deli_des      	nvarchar(500),
    user_id			bigint(9)       NOT NULL,
    CONSTRAINT    FK_DeliUser       FOREIGN KEY (user_id)      REFERENCES UserInfo(user_id),
    CONSTRAINT    CHK_deli_status  CHECK (deli_status IN ('A','N')) -- arrived and not arrived
);

CREATE TABLE IF NOT EXISTS AddCart (
    user_id       bigint(9)       NOT NULL,
    prod_id      bigint(9)       NOT NULL,
    ac_time       DATE,
    ac_quantity   tinyint,
    CONSTRAINT    FK_CartUser       FOREIGN KEY (user_id)      REFERENCES UserInfo(user_id),
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

INSERT INTO TypeTea(tt_id, tt_name) VALUES
(1, 'Rose tea'),
(2, 'Chrysanthemum tea'),
(3, 'Jasmine tea'),
(4, 'Sacred lotus tea'),
(5, 'Marigold tea'),
(6, 'Lavender tea'),
(7, 'Osmanthus tea'),
(8, 'Chamomile tea'); 

/*
INSERT INTO Brand(brand_id, brand_brand, brand_status, brand_des, tt_id) VALUES
(100000001, 'Twinings', 'A', null, 1),
(100000002, 'Yogi tea', 'U', null, 1),
(100000003, 'Dilmah', 'A', null, 3),
(100000004, 'Tazo', 'A', null, 4), 
(100000005, 'TerraVita', 'U', null, 5),
(100000006, 'Ten Ren', 'A', null, 2),
(100000007, 'Cha Wu', 'A', null, 7),
(100000008, 'Lipton', 'U', null, 8),
(100000009, 'Gryphon', 'U', null, 6),
(100000010, 'Traditional Medicinals', 'A', null, 8);

INSERT INTO Goods(brand_id, g_price, g_unit) VALUES
(100000001, '400.00', 'box'),
(100000004, '150.00', 'bag'),
(100000002, '250.00', 'box'),
(100000003, '360.00', 'bag'),
(100000010, '220.00', 'bag'),
(100000005, '280.00', 'bag'),
(100000006, '420.00', 'box'),
(100000009, '500.00', 'box'),
(100000007, '250.00', 'bag'),
(100000008, '350.00', 'box');
*/
INSERT INTO Product(prod_id, prod_name, prod_status, prod_des, tt_id) VALUES
(100000001, 'Twinings', 'A', null, 1),
(100000002, 'Yogi tea', 'U', null, 1),
(100000003, 'Dilmah', 'A', null, 3),
(100000004, 'Tazo', 'A', null, 4), 
(100000005, 'TerraVita', 'U', null, 5),
(100000006, 'Ten Ren', 'A', null, 2),
(100000007, 'Cha Wu', 'A', null, 7),
(100000008, 'Lipton', 'U', null, 8),
(100000009, 'Gryphon', 'U', null, 6),
(100000010, 'Traditional Medicinals', 'A', null, 8);

INSERT INTO Product_details(prod_id, prod_price, prod_unit) VALUES
(100000001, '400.00', 'box'),
(100000004, '150.00', 'bag'),
(100000002, '250.00', 'box'),
(100000003, '360.00', 'bag'),
(100000010, '220.00', 'bag'),
(100000005, '280.00', 'bag'),
(100000006, '420.00', 'box'),
(100000009, '500.00', 'box'),
(100000007, '250.00', 'bag'),
(100000008, '350.00', 'box');


/*INSERT INTO Delivery(deli_id, deli_status, deli_des, user_fname, user_lname, user_address, user_phone) VALUES
(200000001, 'A', null, 'jaojam', 'eiei','59/52 Yaowarat road Bangkok 10110', '0956248545'),
(200000002, 'N', null, 'Igonnasleep', 'sleepy', '1518 Kanjanavanich road Songkhla 90110', '0986485425'),
(200000003, 'N', null, 'aaimmm', 'heyyyy', '1027 Phloen Chit road Bangkok 10330', '0975842659'),
(200000004, 'A', null, 'kapizza', 'hiwaa', '206 Khao San road Bangkok 10200', '0963285964'),
(200000005, 'N', null, 'Iloveshabu', 'buffet', '99/99 Chaengwattana road Nonthaburi 11120', '0945123486'),
(200000006, 'A', null, 'Ilovesalmon', 'luvvv', '1/129 Mittraphap road Khon Kaen 40000', '0926359425'),
(200000007, 'A', null, 'Mintthy', 'InwZaaa', '1/11 Sathon Rd, Bkk 10120', '0916865811');*/


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

SELECT * FROM product;

SELECT * FROM product_details;

SELECT * FROM addcart;

SELECT * FROM delivery;

SELECT * FROM purchase_order;

SELECT t.tt_id, t.tt_name, p.prod_id, b.prod_name, d.prod_price, d.prod_unit 
FROM typetea t
INNER JOIN product p ON t.tt_id = p.tt_id
INNER JOIN product_details d ON p.prod_id = d.prod_id;

SELECT t.tt_name, p.prod_name, d.prod_price, d.prod_unit 
FROM typetea t
INNER JOIN product p ON t.tt_id = p.tt_id
INNER JOIN product_details d ON p.prod_id = d.prod_id
WHERE (LOWER(t.tt_name) LIKE '%%') 
	  AND (d.prod_price BETWEEN 0 AND 500)
      AND (d.prod_unit  = "box" OR d.prod_unit  = "bag");
    
SELECT userinfo.user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer, login_user, login_pwd, login_role, login_time
FROM userinfo INNER JOIN logininfo ON userinfo.user_id = logininfo.user_id
ORDER BY user_id ASC;     

INSERT INTO UserInfo (user_id, user_fname, user_lname, user_phone, user_email, user_address, user_prefer) VALUE
(100000007, 'Igonnasleep', 'sleepy', '0986485425', 'Igonnasleep@gmail.com', '1518 Kanjanavanich road Songkhla 90110', 'Chrysanthemum tea');

INSERT INTO LoginInfo(login_user, login_pwd, login_role, login_time, user_id) VALUE
('Igonnasleep_sle', 'sleep1234', 'C', '2020-05-07 07:20:20', 100000007);

DELETE FROM LoginInfo WHERE user_id = 100000008;
DELETE FROM UserInfo WHERE user_id = 100000008;

SELECT MAX(user_id) FROM userinfo;
