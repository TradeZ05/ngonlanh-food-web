package com.ngonlanh.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực OTP - Ngon Lành Food");
        message.setText("Chào bạn,\n\nMã xác thực OTP đăng ký tài khoản của bạn là: " + otp 
                + "\n\nMã này sẽ hết hạn trong 5 phút.\nCảm ơn bạn đã đồng hành cùng Ngon Lành!");
        mailSender.send(message);
    }
}