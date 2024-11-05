package com.citystories.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CityStoriesApplication {
	public static void main(String[] args) {
		SpringApplication.run(CityStoriesApplication.class, args);
	}
}
