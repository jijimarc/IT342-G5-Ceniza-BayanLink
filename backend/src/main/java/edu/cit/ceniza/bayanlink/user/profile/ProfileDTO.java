package edu.cit.ceniza.bayanlink.user.profile;
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
    private int age;
    private String userProfileImage;
    private String address;
    private String contactNumber;
    private String civilStatus;
    private String voterStatus;
    private String occupation;
}