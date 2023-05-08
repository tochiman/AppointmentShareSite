# AppointmentShareSite(予定共有サイト)

## 導入方法
1. このリポジトリをクローンする
```
git clone https://github.com/tochiman/AppointmentShareSite.git
```
2. ディレクトリを移動
```
cd AppointmentShareSite/front
```
3. ライブラリのインストール
```
yarn install
```
4. 環境変数の設定
- `AppointmentShareSite/db/.env_sql`として保存
```
MYSQL_DATABASE=AppointmentShareSite
MYSQL_USER=admin
MYSQL_PASSWORD=PassworD
MYSQL_ROOT_PASSWORD=rootPass
```
- `AppointmentShareSite/front/.env`として保存
```
NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='YrhfNmVevj9tm6oI0cjdyoXxLDZw8YZX0BhtK83uomM='
API_FRONT='http://localhost:8080'
API_BACK='http://api:8080'
GOOGLE_CLIENT_ID=''
GOOGLE_CLIENT_SECRET=''
```

5. 起動
上はイメージが合計で約3GB、下は本番環境用で合計で約1.5GBほど。
```
docker compose up       
or
docker compose -f docker-compose-production.yml up
```
6.　http://localhost:3000 にアクセス