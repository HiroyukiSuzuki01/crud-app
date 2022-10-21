CREATE DATABASE IF NOT EXISTS crud_app;

CREATE TABLE IF NOT EXISTS crud_app.prefectures(
  id int auto_increment primary key,
  name varchar(10) not null,
  created_at datetime,
  updated_at datetime
);

CREATE TABLE IF NOT EXISTS crud_app.hobbies(
  id int auto_increment primary key,
  name varchar(10) not null,
  created_at datetime,
  updated_at datetime
);

CREATE TABLE IF NOT EXISTS crud_app.user_profiles(
  user_id int auto_increment primary key,
  name varchar(10),
  age int,
  gender int,
  selfDescription text,
  prefecture_id int,
  address varchar(25),
  created_at datetime,
  updated_at datetime,
  FOREIGN KEY (prefecture_id) REFERENCES prefectures(id)
);

CREATE TABLE IF NOT EXISTS crud_app.user_profile_hobby(
  user_id int,
  hobby_id int not null,
  created_at datetime,
  updated_at datetime,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
  UNIQUE (user_id, hobby_id)
);