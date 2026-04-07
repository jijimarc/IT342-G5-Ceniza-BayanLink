package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.RegisterDTO;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.service.UserFactory;
import edu.cit.ceniza.bayanlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserRepository userRepository;
    private final UserFactory userFactory; // Inject the Factory

    public User register(RegisterDTO data) {
        if (!data.getUserPassword().equals(data.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        if (userRepository.existsByUserEmail(data.getUserEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Delegate object creation to the Factory Method
        // You can pass a specific role here if your DTO supports it,
        // otherwise it defaults to Resident logic inside the factory.
        User newUser = userFactory.createUserEntity(data, "RESIDENT");

        return userRepository.save(newUser);
    }
}