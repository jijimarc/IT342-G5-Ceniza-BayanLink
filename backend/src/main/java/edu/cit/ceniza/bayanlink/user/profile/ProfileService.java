package edu.cit.ceniza.bayanlink.user.profile;

import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
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
        dto.setAge(user.getAge());
        dto.setUserProfileImage(user.getUserProfileImage());

        if (user.getResidentProfile() != null) {
            Resident resident = user.getResidentProfile();
            dto.setAddress(resident.getAddress());
            dto.setContactNumber(resident.getContactNumber());
            dto.setCivilStatus(resident.getCivilStatus());
            dto.setVoterStatus(resident.getVoterStatus());
            dto.setOccupation(resident.getOccupation());
        }

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

        Resident resident = existingUser.getResidentProfile();
        if (resident == null) {
            resident = new Resident();
            resident.setUser(existingUser);
            resident.setUserId(existingUser.getUserId());
            existingUser.setResidentProfile(resident);
        }
        resident.setAddress(data.getAddress());
        resident.setContactNumber(data.getContactNumber());
        resident.setCivilStatus(data.getCivilStatus());
        resident.setVoterStatus(data.getVoterStatus());
        resident.setOccupation(data.getOccupation());

        return userRepository.save(existingUser);
    }

    public void deleteAccount(int userId) {
        userRepository.deleteById(userId);
    }
}