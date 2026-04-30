package com.ngonlimage.backend.repository;

import com.ngonlimage.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // Thêm dòng này
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Thêm dòng này

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Modifying 
    @Transactional 
    void deleteByIsActiveFalseAndOtpExpiryTimeBefore(LocalDateTime dateTime);
}