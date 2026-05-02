package edu.cit.ceniza.bayanlink.service;

import edu.cit.ceniza.bayanlink.dto.RegisterDTO;
import edu.cit.ceniza.bayanlink.entity.Official;
import edu.cit.ceniza.bayanlink.entity.Resident;
import edu.cit.ceniza.bayanlink.entity.Role;
import edu.cit.ceniza.bayanlink.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFactory {

    private final PasswordEncoder passwordEncoder;

    // THE FACTORY METHOD
    // It encapsulates the complex creation logic and decides which specific
    // profile object (Resident or Official) to attach based on the context.
    public User createUserEntity(RegisterDTO data, String requestedRole) {
        User newUser = new User();
        newUser.setUserEmail(data.getUserEmail());
        newUser.setUserFirstname(data.getUserFirstName());
        newUser.setUserLastname(data.getUserLastName());
        newUser.setUserPassword(passwordEncoder.encode(data.getUserPassword()));

        // Factory decision logic
        if ("OFFICIAL".equalsIgnoreCase(requestedRole)) {
            newUser.setUserRole(Role.OFFICIAL);
            Official newOfficial = new Official();
            newOfficial.setUser(newUser);
            // Assuming your User entity has a setOfficialProfile method
            // newUser.setOfficialProfile(newOfficial);
        } else {
            // Default to Resident
            newUser.setUserRole(Role.RESIDENT);
            Resident newResident = new Resident();
            newResident.setUser(newUser);
            newUser.setResidentProfile(newResident);
        }

        return newUser;
    }
}