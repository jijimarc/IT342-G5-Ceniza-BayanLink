package edu.cit.ceniza.mobile.auth

data class LoginRequest(
    val userEmail: String,
    val userPassword: String
)

data class LoginResponse(
    val token: String?,
    val userId: Long?,
    val fullname: String?
)

data class RegisterRequest(
    val userEmail: String,
    val userFirstName: String,
    val userLastName: String,
    val userPassword: String
)

data class RegisterResponse(
    val message: String?,
    val success: Boolean?
)