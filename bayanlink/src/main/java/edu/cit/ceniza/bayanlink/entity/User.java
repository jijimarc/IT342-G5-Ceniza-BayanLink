package edu.cit.ceniza.bayanlink.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(unique = true, nullable = false, length = 150)
    private String userEmail;

    @Column(nullable = false, length = 150)
    private String userPassword;

    private String userFirstname;
    private String userLastname;
    private String userMiddlename;
    private LocalDate userBirthdate;
    private LocalDate lastLoginDate;
    private boolean isAuthenticated;
    private boolean isLoggedOut;

    @Enumerated(EnumType.STRING)
    private Role userRole;
    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String userProfileImage;

    @Transient
    @Getter(AccessLevel.NONE)
    private int userAge;
    public int getAge() {
        if (this.userBirthdate == null) return 0;
        return Period.between(this.userBirthdate, LocalDate.now()).getYears();
    }
}