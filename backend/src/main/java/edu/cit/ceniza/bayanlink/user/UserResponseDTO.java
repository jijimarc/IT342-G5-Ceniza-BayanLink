package edu.cit.ceniza.bayanlink.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Integer userId;
    private String fullName;
    private String userEmail;
    private Role userRole;

    public UserResponseDTO(User user) {
        this.userId = user.getUserId();
        this.fullName = user.getUserFirstname() + " " + user.getUserLastname();
        this.userEmail = user.getUserEmail();
        this.userRole = user.getUserRole();
    }
}