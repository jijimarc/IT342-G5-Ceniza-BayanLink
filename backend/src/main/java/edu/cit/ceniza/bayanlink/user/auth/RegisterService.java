package edu.cit.ceniza.bayanlink.user.auth;

import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserFactory;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserRepository userRepository;
    private final UserFactory userFactory;

    public User register(RegisterDTO data) {
        if (!data.getUserPassword().equals(data.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        if (userRepository.existsByUserEmail(data.getUserEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User newUser = userFactory.createUserEntity(data, "RESIDENT");

        return userRepository.save(newUser);
    }
}