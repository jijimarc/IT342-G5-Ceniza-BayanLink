package edu.cit.ceniza.bayanlink.repository;

import edu.cit.ceniza.bayanlink.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByResident_UserId(Integer userId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByAppointmentDate(LocalDate date);
}