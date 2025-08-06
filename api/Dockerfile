FROM golang:1.22-bookworm AS build

WORKDIR /build/

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /build/trellis-api main.go 

FROM debian:bookworm-slim

WORKDIR /trellis-api
COPY --from=build /build/trellis-api /trellis-api/trellis-api

EXPOSE 3000
CMD [ "/trellis-api/trellis-api" ]