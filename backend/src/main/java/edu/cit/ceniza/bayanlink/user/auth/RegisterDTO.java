package edu.cit.ceniza.bayanlink.user.auth;
import lombok.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email format")
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$", message = "Only @gmail.com email addresses are allowed")
    private String userEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).+$",
            message = "Password must contain at least one number and one special character"
    )
    private String userPassword;

    private String userFirstName;
    private String userLastName;
    private String confirmPassword;
}