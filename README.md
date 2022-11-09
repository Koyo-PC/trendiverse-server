# TrenDiverse Server

[TrenDiverseアプリ](https://github.com/Koyo-PC/trendiverse-app)のサーバーとなります。
サーバーをセルフホストしたい場合、本レポジトリをCloneし、Docker Composeで実行したのちに、アプリ側のサーバーアドレスを書き換え、Flutter SDKを用いてモバイル向けにビルドを行ってください。

*パソコン甲子園2022 モバイル部門にて、チーム「sprouts」として作成したアプリケーションです。<br>
ベストデザイン賞およびバンタン賞を受賞しました。(参考→[プレゼンの様子](https://youtu.be/tmhLiQvS4M4?t=2995))*

*このアプリケーションは現状のまま提供され、一切のサポートは提供されません。バグや仕様変更、サーバーの停止などによりサービスを利用できなくなる恐れもあります。ご了承ください。*

---

## Install dependency

Note: Ubuntu

### Docker & Docker Compose

<https://docs.docker.com/engine/install/ubuntu/>

```bash
$ sudo apt update
$ sudo apt install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt update
### if Receiving a GPG error:
### $ sudo chmod a+r /etc/apt/keyrings/docker.gpg
### $ sudo apt update # retry
$ sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### MySQL Client(Optional)

```bash
$ sudo apt update
$ sudo apt install mysql-client
```

## Clone

```bash
$ cd /hoge/huga
$ git clone git@github.com:Koyo-PC/trendiverse-server.git
$ cd trendiverse-server
```

## Setup secrets

```bash
$ cd secrets
$ ./setup.sh
```

## Run

```bash
$ sudo docker compose up -d
$ sudo docker compose ps # check

$ mysql -h localhost -P 3306 -u root -p --protocol=tcp # connect to db, need mysql-client
```

## Update

```bash
$ sudo docker compose up -d
```

## Exit

```bash
$ sudo docker compose stop
```

## Delete

```bash
$ sudo docker compose down --volumes
```
