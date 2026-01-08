FROM eclipse-temurin:17-alpine

WORKDIR /app

# Download org.json library for JSON parsing
RUN wget -O /app/json.jar https://repo1.maven.org/maven2/org/json/json/20231013/json-20231013.jar

RUN addgroup -S coderunner && adduser -S coderunner -G coderunner

COPY --chown=coderunner:coderunner execute-java.sh /app/execute.sh
RUN chmod +x /app/execute.sh

USER coderunner

ENTRYPOINT ["/app/execute.sh"]