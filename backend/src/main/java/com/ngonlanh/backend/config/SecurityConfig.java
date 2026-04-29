package com.ngonlanh.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// 👉 TÔI ĐÃ BỔ SUNG CÁC IMPORT THIẾU Ở ĐÂY
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // CẤP VISA CHO CÁC NHÀ NÀY ĐƯỢC PHÉP VÀO:
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5500", 
            "http://127.0.0.1:5500",
            "http://localhost:3000" 
        ));
        
        // CÁC HÀNH ĐỘNG ĐƯỢC PHÉP LÀM:
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // CÁC LOẠI CHÌA KHÓA ĐƯỢC MANG THEO:
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 👉 TÔI ĐÃ BỔ SUNG LỆNH GỌI CORS Ở ĐÂY (VÔ CÙNG QUAN TRỌNG)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            .csrf(csrf -> csrf.disable()) 
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                // 1. NHÓM CÔNG CỘNG: Ai cũng vào được (Kể cả không có Token)
                .requestMatchers("/api/auth/**", "/error").permitAll()
                
                // Thẻ VIP cho Swagger qua cổng
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                .requestMatchers(org.springframework.http.HttpMethod.GET, 
                    "/api/categories/**", 
                    "/api/products/**", 
                    "/api/reviews/product/**"
                ).permitAll()
                
                // 2. NHÓM ADMIN: Chỉ dành riêng cho chủ quán
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 3. NHÓM USER: Các hành động cần đăng nhập (Review, Đặt hàng, Địa chỉ...)
                .anyRequest().authenticated() 
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}