package com.app.utils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import com.app.models.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;

@Component
public class OtpUtil {
    @Autowired
    static
    UserRepository userRepository;

    @Autowired
    private EmailUtil emailUtil;

    public static String generateOtp() {
        Random random = new Random();
        int randomNumber = random.nextInt(999999);
        String output = Integer.toString(randomNumber);

        while (output.length() < 6) {
            output = "0" + output;
        }
        return output;
    }

    public static String verifyAccount(String email, String otp) {
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getOtp().equals(otp) && Duration.between(user.getOtpGeneratedTime(),
                    LocalDateTime.now()).getSeconds() < (1 * 60)) {
                userRepository.save(user);
                return "OTP verified you can login";
            }
        }
        return "User not found or OTP is invalid. Please regenerate OTP and try again.";
    }

    public String regenerateOtp(String email) {
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String otp = generateOtp();
            emailUtil.sendOtpEmail(email, otp);
            user.setOtp(otp);
            user.setOtpGeneratedTime(LocalDateTime.now());
            userRepository.save(user);
            return "Email sent... please verify account within 1 minute";
        } else {
            return "User not found with this email: " + email;
        }
    }



}