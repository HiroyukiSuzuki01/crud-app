# 実行方法

```
※前提条件として、Dockerが起動すること
1. git cloneでcrud-appプロジェクトをローカルへ取得
2. $docker-compose up -dでコンテナが起動する
3. $docker exec -it dev-db bashでDBコンテナへ接続する
4. prefectures.csvとhobbies.csvのデータをDBへ読み込ませる
 → Docker起動時に読み込むようにしたかったが、上手くできず。
 4.1 $mysql -u root -p --local_infile=1
 4.2 $SET GLOBAL local_infile=on;
 4.3 $LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/prefectures.csv' INTO TABLE prefectures FIELDS TERMINATED BY ',' (id, name) SET created_at = CURRENT_TIMESTAMP;
 4.4 $LOAD DATA LOCAL INFILE '/docker-entrypoint-initdb.d/hobbies.csv' INTO TABLE hobbies FIELDS TERMINATED BY ',' (id, name) SET created_at = CURRENT_TIMESTAMP;
```
