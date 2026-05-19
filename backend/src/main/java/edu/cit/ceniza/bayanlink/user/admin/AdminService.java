package edu.cit.ceniza.bayanlink.user.admin;

import edu.cit.ceniza.bayanlink.user.Role;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserFactory;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import edu.cit.ceniza.bayanlink.user.UserResponseDTO;
import edu.cit.ceniza.bayanlink.user.auth.RegisterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserFactory userFactory;

    public List<UserResponseDTO> getUsersByType(Role role) {
        List<User> users = userRepository.findByUserRole(role);
        return users.stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    public UserResponseDTO createOfficialOrAdmin(RegisterDTO data, String requestedRole) {
        if (userRepository.existsByUserEmail(data.getUserEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        if ("RESIDENT".equalsIgnoreCase(requestedRole)) {
            throw new IllegalArgumentException("Residents must register via the mobile app.");
        }

        User newUser = userFactory.createUserEntity(data, requestedRole);

        User savedUser = userRepository.save(newUser);
        return new UserResponseDTO(savedUser);
    }

    public void deleteAccount(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User ID not found.");
        }
        userRepository.deleteById(userId);
    }
}