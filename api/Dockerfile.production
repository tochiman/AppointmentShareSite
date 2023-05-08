FROM golang:1.19-alpine as dev

ENV ROOT=/go/src
ENV CGO_ENABLED 0
WORKDIR ${ROOT}

# アップデートとgitのインストール
RUN apk update && apk add git

COPY ./ ./
RUN go mod download
RUN go build -o /go/bin/main ./main.go

FROM gcr.io/distroless/static-debian11

COPY --from=dev /go/bin/main /
EXPOSE 8080

CMD ["/main"]