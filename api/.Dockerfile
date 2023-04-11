FROM golang:1.19-alpine
RUN apk update && apk add git
WORKDIR /go/src

CMD ["go", "run", "main.go"]