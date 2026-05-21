package edu.cit.ceniza.mobile.features.profile

data class ResidentProfile(
    val userId: Int,
    val userEmail: String?,
    val userFirstname: String?,
    val userLastname: String?,
    val userMiddlename: String?,
    val userBirthdate: String?,
    val age: Int?,
    val address: String?,
    val contactNumber: String?,
    val civilStatus: String?,
    val voterStatus: String?,
    val occupation: String?
)

data class ProfileUpdateResponse(
    val message: String,
    val success: Boolean
)