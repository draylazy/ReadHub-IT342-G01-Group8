package com.readhub.bookmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // Import this

@SpringBootApplication
@EnableScheduling // Add this annotation
public class ReadHubBookManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReadHubBookManagementSystemApplication.class, args);
	}

}