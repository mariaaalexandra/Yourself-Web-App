package com.app.controllers;

import com.app.models.PasswordResetToken;
import com.app.payload.request.LoginRequest;
import com.app.payload.request.SignupRequest;
import com.app.payload.response.MessageResponse;
import com.app.payload.response.UserInfoResponse;
import com.app.models.User;
import com.app.repository.PasswordResetTokenRepository;
import com.app.repository.UserRepository;
import com.app.security.services.UserDetailsImpl;
import com.app.utils.EmailUtil;
import com.app.utils.OtpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.security.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserRepository userService;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private OtpUtil otpUtil;

    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String senderEmail; // Read sender email from application.properties

    @PostMapping("/forgot-password")
    public ResponseEntity<?> processForgotPassword(@RequestParam("email") String userEmail) {
        // Find user by email
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found!"));
        }

        // Create token
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(calculateExpiryDate(24 * 60)); // 24 hours for token validity

        passwordResetTokenRepository.save(token);

        // Send email with reset link
        sendResetEmail(userEmail, token.getToken());

        return ResponseEntity.ok(new MessageResponse("Reset link sent to email"));
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date(cal.getTime().getTime()));
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Date(cal.getTime().getTime());
    }

    private void sendResetEmail(String userEmail, String token) {
        // Create the email
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(senderEmail);
        mailMessage.setTo(userEmail);
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("To reset your password, click the link below:\n"
                + "http://localhost:8080/api/auth/reset-password?token=" + token);
        // Send the email
        mailSender.send(mailMessage);
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> processResetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        // Find token and user
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid token."));
        }

        // Validate token expiry
        if (resetToken.getExpiryDate().before(new Date())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Token has expired."));
        }

        // Update user's password
        User user = resetToken.getUser();
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found."));
        }

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        // Remove the reset token
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(new MessageResponse("Password successfully reset."));
    }

    @RequestMapping(value = "/getCurrentUser", method = RequestMethod.GET)
    public User getUser(@RequestParam long userId) {
        User user = new User();
        user = userRepository.findUserById(userId);
        return user;
    }

    @PutMapping("/verify-account")
    public ResponseEntity<String> verifyAccount(@RequestParam String email,
                                                @RequestParam String otp) {
        User user = userRepository.findByEmail(email);
        if (user!=null) {
            if (user.getOtp().equals(otp) && Duration.between(user.getOtpGeneratedTime(),
                    LocalDateTime.now()).getSeconds() < (3600)) {
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

    }

    @PutMapping("/regenerate-otp")
    public ResponseEntity<String> regenerateOtp(@RequestParam String email) {
        return new ResponseEntity<>(otpUtil.regenerateOtp(email), HttpStatus.OK);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws MessagingException {

        System.out.println(loginRequest);

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String otp = OtpUtil.generateOtp();
        User userUpdate = userRepository.findByEmail(userDetails.getEmail());
        userUpdate.setOtpGeneratedTime(LocalDateTime.now());
        // Set the OTP for the user
        userUpdate.setOtp(otp);

        // Save the user with the updated OTP
        userRepository.save(userUpdate);

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(senderEmail);
        mailMessage.setTo(userDetails.getEmail());
        mailMessage.setSubject("Verify OTP");
        mailMessage.setText("This is your OTP for login:\n"+
                "http://localhost:8080/api/auth/verify-account?email=" + userDetails.getEmail() + "&otp=" + otp);

        mailSender.send(mailMessage);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE)
                .body(new UserInfoResponse(userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail()));
    }



    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }



    @RequestMapping(value = "/updateUserInfo", method = RequestMethod.POST)
    public ResponseEntity updateUser(@RequestBody HashMap<String, Object> mapper) throws Exception {

        long id = (int) mapper.get("id");
        String username = (String) mapper.get("username");
        String email = (String) mapper.get("email");

        User user = userRepository.findUserById(id);


        if (user == null) {
            throw new Exception("User not found");
        }

        user.setEmail(email);
        user.setUsername(username);
        userRepository.save(user);
        return new ResponseEntity(HttpStatus.OK);
    }
}