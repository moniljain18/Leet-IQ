FROM node:18-alpine

WORKDIR /app

RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

ENV NODE_OPTIONS="--max-old-space-size=256"

COPY execute-js.sh /app/execute.sh
RUN chmod +x /app/execute.sh

USER coderunner

CMD ["/bin/sh"]