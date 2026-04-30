package com.ngonlimage.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dguluci4l"); // Thay bằng Cloud Name của ní
        config.put("api_key", "594373524364822");       // Thay bằng API Key của ní
        config.put("api_secret", "vyl6drKMWdkpTNrHUVGNyWFvA6s"); // Thay bằng API Secret của ní
        return new Cloudinary(config);
    }
}