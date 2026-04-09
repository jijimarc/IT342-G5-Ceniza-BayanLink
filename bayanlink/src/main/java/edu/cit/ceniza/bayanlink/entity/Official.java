package edu.cit.ceniza.bayanlink.entity;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int officialId;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
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
}
