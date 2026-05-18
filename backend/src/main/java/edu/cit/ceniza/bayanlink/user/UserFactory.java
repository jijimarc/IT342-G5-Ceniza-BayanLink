package edu.cit.ceniza.bayanlink.user;

import edu.cit.ceniza.bayanlink.user.auth.RegisterDTO;
import edu.cit.ceniza.bayanlink.user.official.Official;
import edu.cit.ceniza.bayanlink.user.resident.Resident;
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