package edu.cit.ceniza.bayanlink.config;

import edu.cit.ceniza.bayanlink.user.official.Official;
import edu.cit.ceniza.bayanlink.user.Role;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. Core Administrative Officials
        seedOfficial("captain@gmail.com", "Jian Marc", "Ceniza", "Barangay Captain", "Executive");
        seedOfficial("secretary@gmail.com", "Maribeth", "Ceniza", "Barangay Secretary", "Administration");

        // 2. Health Clinic Staff
        seedOfficial("dr.reyes@gmail.com", "Ricardo", "Reyes", "Head Physician", "Health");
        seedOfficial("nurse.santos@gmail.com", "Elena", "Santos", "Registered Nurse", "Health");
        seedOfficial("dr.lim@gmail.com", "Jonathan", "Lim", "Pediatrician", "Health");

        System.out.println("All default officials have been seeded!");
    }

    private void seedOfficial(String email, String firstName, String lastName, String position, String committee) {

        if (!userRepository.existsByUserEmail(email)) {
            User user = new User();
            user.setUserEmail(email);
            user.setUserFirstname(firstName);
            user.setUserLastname(lastName);
            user.setUserPassword(passwordEncoder.encode("admin123!"));
            user.setUserRole(Role.OFFICIAL);

            Official official = new Official();
            official.setPosition(position);
            official.setCommittee(committee);
            official.setTermStart(LocalDate.of(2026, 1, 1));
            official.setTermEnd(LocalDate.of(2030, 1, 31));
            official.setUser(user);
            user.setOfficialProfile(official);

            userRepository.save(user);
        }
    }
}