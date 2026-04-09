package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.LoginDTO;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Map<String, Object> login(LoginDTO data) {
        User user = userRepository.findByUserEmail(data.getUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(data.getUserPassword(), user.getUserPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        user.setAuthenticated(true);
        user.setLastLoginDate(LocalDate.now());
        userRepository.save(user);
        String token = jwtService.generateToken(user.getUserEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getUserId());
        response.put("email", user.getUserEmail());
        response.put("role", user.getUserRole());
        response.put("firstname", user.getUserFirstname());
        response.put("lastname", user.getUserLastname());
        return response;
    }
}