FROM golang:1.19-alpine

ENV ROOT=/go/src
ENV CGO_ENABLED 0
WORKDIR ${ROOT}

# アップデートとgitのインストール
RUN apk update && apk add git

COPY ./ ./
RUN go mod download
EXPOSE 8080

CMD ["go", "run", "main.go"]