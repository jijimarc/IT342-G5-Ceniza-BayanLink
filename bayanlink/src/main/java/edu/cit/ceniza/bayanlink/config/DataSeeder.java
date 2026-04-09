package edu.cit.ceniza.bayanlink.config;

import edu.cit.ceniza.bayanlink.entity.Official;
import edu.cit.ceniza.bayanlink.entity.Role;
import edu.cit.ceniza.bayanlink.entity.User;
import edu.cit.ceniza.bayanlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUserEmail("captain@bayanlink.com")) {

            User officialUser = new User();
            officialUser.setUserEmail("captain@bayanlink.com");
            officialUser.setUserFirstname("Kapitan");
            officialUser.setUserLastname("Dela Cruz");
            officialUser.setUserPassword(passwordEncoder.encode("Admin123!"));
            officialUser.setUserRole(Role.OFFICIAL);

            Official officialProfile = new Official();
            officialProfile.setPosition("Barangay Captain");
            officialProfile.setCommittee("Executive");

            officialProfile.setUser(officialUser);
            officialUser.setOfficialProfile(officialProfile);

            userRepository.save(officialUser);

            System.out.println("Default Official account seeded successfully!");
        }
    }
}