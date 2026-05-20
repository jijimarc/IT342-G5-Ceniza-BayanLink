package edu.cit.ceniza.bayanlink.config;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAppointmentApprovalEmail(String recipientEmail, String residentName, String serviceType, String date, String time) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("bayanlink.acc@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("BayanLink: Appointment Approved!");

        String emailBody = "Hello " + residentName + ",\n\n"
                + "Great news! Your Barangay Clinic appointment has been APPROVED.\n\n"
                + "Details:\n"
                + "Service: " + serviceType + "\n"
                + "Date: " + date + "\n"
                + "Time: " + time + "\n\n"
                + "Please arrive 10 minutes early. If you need to cancel, please log into your BayanLink dashboard.\n\n"
                + "Stay safe,\n"
                + "The BayanLink Team";

        message.setText(emailBody);

        mailSender.send(message);
    }

    public void sendAppointmentRejectEmail(String recipientEmail, String residentName, String serviceType, String date) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("bayanlink.acc@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("BayanLink: Appointment Request Update");

        String emailBody = "Hello " + residentName + ",\n\n"
                + "We regret to inform you that your Barangay Clinic appointment request has been DECLINED.\n\n"
                + "Details of the declined request:\n"
                + "Service: " + serviceType + "\n"
                + "Date: " + date + "\n\n"
                + "This usually happens if the schedule is full or the requested service is unavailable on that day. Please log into your BayanLink dashboard to request a different date, or visit the Barangay Hall for urgent concerns.\n\n"
                + "Stay safe,\n"
                + "The BayanLink Team";

        message.setText(emailBody);

        mailSender.send(message);
    }

    public void sendDocumentReadyEmail(String recipientEmail, String residentName, String documentType, Long requestId) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("bayanlink.acc@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("BayanLink: Your Document is Ready for Pickup!");

        String emailBody = "Hello " + residentName + ",\n\n"
                + "Great news! Your request for a " + documentType + " has been successfully processed and approved.\n\n"
                + "Details:\n"
                + "Document: " + documentType + "\n"
                + "Reference Number: #" + requestId + "\n\n"
                + "You may now visit the Barangay Hall to pick up your physical document. Please remember to present your reference number and prepare the necessary fees at the reclamation counter.\n\n"
                + "Stay safe,\n"
                + "The BayanLink Team";

        message.setText(emailBody);

        mailSender.send(message);
    }

    public void sendDocumentRejectEmail(String recipientEmail, String residentName, String documentType, Long requestId) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("bayanlink.acc@gmail.com");
        message.setTo(recipientEmail);
        message.setSubject("BayanLink: Document Request Update");

        String emailBody = "Hello " + residentName + ",\n\n"
                + "We regret to inform you that your request for a " + documentType + " (Ref: #" + requestId + ") has been DECLINED by our officials.\n\n"
                + "This usually happens if your attached ID verification image was blurry/illegible, or if your submitted details do not align with current community census records.\n\n"
                + "Please log into your BayanLink dashboard to review the rejection status or submit a new request with updated credentials.\n\n"
                + "Stay safe,\n"
                + "The BayanLink Team";

        message.setText(emailBody);

        mailSender.send(message);
    }
}