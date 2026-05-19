package edu.cit.ceniza.mobile.features.appointment

data class AppointmentRequestPayload(
    val serviceName: String,
    val appointmentDate: String,
    val timeSlot: String,
    val additionalNotes: String?
)

data class AppointmentResponse(
    val message: String,
    val success: Boolean
)