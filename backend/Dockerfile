# ===== Stage 1: Build =====
# Use Maven + JDK image to build your Spring Boot project
FROM maven:3.9.3-openjdk-21 AS build

WORKDIR /app

# Copy pom.xml first and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Package the application (skip tests for faster build)
RUN mvn -B -DskipTests package

# ===== Stage 2: Runtime =====
# Use a smaller JDK image to run the built jar
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot app uses
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]
