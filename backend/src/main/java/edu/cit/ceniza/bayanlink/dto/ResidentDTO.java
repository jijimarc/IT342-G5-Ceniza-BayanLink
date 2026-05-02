package edu.cit.ceniza.bayanlink.dto;

import lombok.*;
import java.time.LocalDate;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResidentDTO {
    private Integer userId;
    private String fullName; 
    private String userEmail;
    private LocalDate userBirthdate;
    private int age;
    private String address;
    private String contactNumber;
    private String civilStatus;
    private String voterStatus;
    private String occupation;
}