package edu.cit.ceniza.bayanlink.user.auth;
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
