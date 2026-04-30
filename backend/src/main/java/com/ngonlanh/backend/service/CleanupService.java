package com.ngonlimage.backend.service;

import com.ngonlimage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CleanupService {

    @Autowired
    private UserRepository userRepository;

    // Chạy mỗi 1 phút một lần để bạn dễ quan sát kết quả (60000ms)
    @Scheduled(fixedRate = 600000)
    @Transactional
    public void deleteUnverifiedUsers() {
        LocalDateTime now = LocalDateTime.now();
        userRepository.deleteByIsActiveFalseAndOtpExpiryTimeBefore(now);
        System.out.println("--- [HỆ THỐNG] Đã quét rác lúc: " + now);
    }
}