package edu.cit.ceniza.bayanlink.dto;

import lombok.*;
import java.time.LocalDate;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfficialDTO {
    private Integer officialId;
    private Integer userId; 
    
    private String fullName;
    private String userEmail;
    
    private String address;
    private String contactNumber;
    private String positionTitle; 
    private LocalDate termStart;
    private LocalDate termEnd;
}