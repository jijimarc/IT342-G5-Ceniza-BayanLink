package edu.cit.ceniza.bayanlink.user.official;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.cit.ceniza.bayanlink.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "officials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Official {

    @Id
    private Integer userId;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String address;
    private String contactNumber;
    private String civilStatus;
    private String voterStatus;
    private String occupation;
    private String position;
    private String committee;
    private LocalDate termStart;
    private LocalDate termEnd;

    @Column(name = "is_present", columnDefinition = "boolean default true")
    private boolean isPresent = true;
}