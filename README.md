# trendiverse-server

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

## Clone

```bash
$ cd /hoge/huga
$ git clone git@github.com:Koyo-PC/trendiverse-server.git
$ cd trendiverse-server
```

## Run

```bash
$ docker compose up -d
$ docker compose ps # check
```

## Update

```bash
$ docker compose up -d
```

## Exit

```bash
$ docker compose stop
```

## Delete

```bash
$ docker compose down --volumes
```
