package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.ProfileDTO;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserRepository userRepository;

    public ProfileDTO getProfile(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileDTO dto = new ProfileDTO();
        dto.setUserId(user.getUserId());
        dto.setUserEmail(user.getUserEmail());
        dto.setUserFirstname(user.getUserFirstname());
        dto.setUserLastname(user.getUserLastname());
        dto.setUserMiddlename(user.getUserMiddlename());
        dto.setUserBirthdate(user.getUserBirthdate());
        dto.setUserProfileImage(user.getUserProfileImage());
        dto.setAge(user.getAge());
        return dto;
    }

    public User updateProfile(ProfileDTO data) {
        User existingUser = userRepository.findById(data.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUserFirstname(data.getUserFirstname());
        existingUser.setUserLastname(data.getUserLastname());
        existingUser.setUserMiddlename(data.getUserMiddlename());
        existingUser.setUserBirthdate(data.getUserBirthdate());
        existingUser.setUserProfileImage(data.getUserProfileImage());
        return userRepository.save(existingUser);
    }

    public void deleteAccount(int userId) {
        userRepository.deleteById(userId);
    }
}