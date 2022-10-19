CREATE DATABASE IF NOT EXISTS crud_app;

CREATE TABLE IF NOT EXISTS crud_app.prefectures(id int auto_increment primary key, name varchar(10) not null, created_at datetime, updated_at datetime);
