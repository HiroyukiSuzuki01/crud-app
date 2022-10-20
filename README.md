# 実行方法

```
※前提条件として、Dockerが起動すること
1. git cloneでcrud-appプロジェクトをローカルへ取得
2. $docker-compose up -dでコンテナが起動する
3. $docker exec -it dev-db bashでDBコンテナへ接続する
4. prefectures.csvとhobbies.csvのデータをDBへ読み込ませる
 → Docker起動時に読み込むようにしたかったが、上手くできず。
```
