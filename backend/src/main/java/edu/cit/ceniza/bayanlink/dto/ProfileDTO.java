package edu.cit.ceniza.bayanlink.dto;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private int userId;
    private String userEmail;
    private String userFirstname;
    private String userLastname;
    private String userMiddlename;
    private LocalDate userBirthdate;
    private String userProfileImage;
    private int age;
}
