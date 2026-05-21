package edu.cit.ceniza.mobile.features.notifications

data class NotificationAlert(
    val id: String,
    val title: String,
    val message: String,
    val type: NotificationType,
    val date: String
)

enum class NotificationType {
    SUCCESS, ERROR
}

data class NotificationDocResponse(
    val requestId: Long,
    val documentType: String,
    val status: String,
    val requestDate: String?
)

data class NotificationApptResponse(
    val appointmentId: Long?,
    val status: String?,
    val appointmentDate: String?
)