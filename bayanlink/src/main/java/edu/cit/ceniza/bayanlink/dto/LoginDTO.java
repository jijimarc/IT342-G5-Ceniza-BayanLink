package edu.cit.ceniza.bayanlink.dto;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String userEmail;
    private String userPassword;
    private String userRole;
    private String userFirstname;
    private String userLastname;
}
