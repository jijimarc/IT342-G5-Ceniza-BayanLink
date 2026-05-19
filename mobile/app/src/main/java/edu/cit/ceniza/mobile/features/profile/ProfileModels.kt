package edu.cit.ceniza.mobile.features.profile

data class ResidentProfile(
    val firstName: String,
    val middleName: String?,
    val lastName: String,
    val email: String,
    val contactNumber: String?,
    val birthDate: String?,
    val age: String?,
    val address: String?,
    val civilStatus: String?,
    val occupation: String?,
    val voterStatus: String?
)

data class ProfileUpdateResponse(
    val message: String,
    val success: Boolean
)