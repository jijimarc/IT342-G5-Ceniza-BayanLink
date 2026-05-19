package edu.cit.ceniza.bayanlink.config;

import edu.cit.ceniza.bayanlink.clinic.ClinicService;
import edu.cit.ceniza.bayanlink.clinic.ClinicServiceRepository;
import edu.cit.ceniza.bayanlink.document.DocumentTemplate;
import edu.cit.ceniza.bayanlink.document.DocumentTemplateRepository;
import edu.cit.ceniza.bayanlink.user.official.Official;
import edu.cit.ceniza.bayanlink.user.Role;
import edu.cit.ceniza.bayanlink.user.User;
import edu.cit.ceniza.bayanlink.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DocumentTemplateRepository templateRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClinicServiceRepository clinicServiceRepository;

    @Override
    public void run(String... args) throws Exception {
        // Admin Account
        seedAdmin("admin@gmail.com", "System", "Administrator");

        // Core Administrative Officials
        seedOfficial("captain@gmail.com", "Jian Marc", "Ceniza", "Barangay Captain", "Executive");
        seedOfficial("secretary@gmail.com", "Maribeth", "Ceniza", "Barangay Secretary", "Administration");
        seedOfficial("receptionist@gmail.com", "Alex", "Ceniza", "Front Desk Receptionist", "Administration");

        // Health Clinic Staff
        seedOfficial("drreyes@gmail.com", "Ricardo", "Reyes", "Head Physician", "Health");
        seedOfficial("nursesantos@gmail.com", "Elena", "Santos", "Registered Nurse", "Health");
        seedOfficial("drlim@gmail.com", "Jonathan", "Lim", "Pediatrician", "Health");

        // Seed Common Barangay Services
        seedServices();
        seedDocumentTemplates();

        System.out.println("Database seeding completed!");
    }

    private void seedAdmin(String email, String firstName, String lastName) {
        if (!userRepository.existsByUserEmail(email)) {
            User user = new User();
            user.setUserEmail(email);
            user.setUserFirstname(firstName);
            user.setUserLastname(lastName);
            user.setUserPassword(passwordEncoder.encode("admin123!"));
            user.setUserRole(Role.ADMIN);
            userRepository.save(user);
        }
    }

    private void seedServices() {
        List<String> commonServices = Arrays.asList(
                "General Consultation",
                "Blood Pressure Monitoring",
                "Maternal Health Check-up",
                "Vaccination & Immunization",
                "Basic Wound Care / First Aid",
                "Free Dental Checkup"
        );

        for (String serviceName : commonServices) {
            if (!clinicServiceRepository.existsByServiceName(serviceName)) {
                ClinicService service = new ClinicService();
                service.setServiceName(serviceName);
                service.setAvailable(true);
                clinicServiceRepository.save(service);
            }
        }
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
    private void seedDocumentTemplates() {
        if (templateRepository.findByDocumentType("Barangay Clearance").isEmpty()) {

            DocumentTemplate clearanceTemplate = new DocumentTemplate();
            clearanceTemplate.setDocumentType("Barangay Clearance");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 2px solid #000;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h3 style="margin: 0;">Republic of the Philippines</h3>
                        <h3 style="margin: 0;">Province of Cebu</h3>
                        <h3 style="margin: 0;">Municipality of Dalaguete</h3>
                        <h2 style="margin: 15px 0; color: #1e3a8a; text-transform: uppercase;">Office of the Barangay Captain</h2>
                    </div>
                    
                    <h1 style="text-align: center; text-decoration: underline; margin-bottom: 40px;">BARANGAY CLEARANCE</h1>
                    
                    <p style="font-size: 1.2em;"><strong>TO WHOM IT MAY CONCERN:</strong></p>
                    
                    <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                        This is to certify that <strong>{{residentName}}</strong>, of legal age, <strong>{{civilStatus}}</strong>, 
                        is a bonafide resident of <strong>{{address}}</strong>, and is personally known to me to be of good moral character.
                    </p>
                    
                    <p style="font-size: 1.2em; line-height: 1.8; text-indent: 40px; text-align: justify;">
                        This certification is being issued upon the request of the above-named person for the purpose of: 
                        <strong>{{purpose}}</strong>.
                    </p>
                    
                    <p style="font-size: 1.2em; margin-top: 40px;">
                        Issued this <strong>{{currentDate}}</strong> at Dalaguete, Cebu, Philippines.
                    </p>
                    
                    <div style="margin-top: 80px; text-align: right;">
                        <p style="margin: 0; text-transform: uppercase; font-weight: bold;">Hon. Barangay Captain Name</p>
                        <p style="margin: 0;">Punong Barangay</p>
                    </div>
                </div>
                """;

            clearanceTemplate.setHtmlContent(htmlContent);
            templateRepository.save(clearanceTemplate);

            System.out.println("Seeded Barangay Clearance Template");
        }
    }
}