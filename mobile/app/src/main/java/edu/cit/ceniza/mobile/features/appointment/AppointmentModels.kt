package edu.cit.ceniza.mobile.features.appointment

data class AppointmentRequestPayload(
    val userId: Int,
    val serviceType: String,
    val appointmentDate: String,
    val timeSlot: String,
    val notes: String?
)

data class AppointmentResponse(
    val id: Int?,
    val referenceNumber: String?,
    val status: String?,
    val serviceType: String?
)