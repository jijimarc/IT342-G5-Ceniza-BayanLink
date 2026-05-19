package edu.cit.ceniza.mobile.auth

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {

    @POST("api/users/login")
    fun loginUser(@Body request: LoginRequest): Call<LoginResponse>

    @POST("api/users/register")
    fun registerUser(@Body request: RegisterRequest): Call<RegisterResponse>
}