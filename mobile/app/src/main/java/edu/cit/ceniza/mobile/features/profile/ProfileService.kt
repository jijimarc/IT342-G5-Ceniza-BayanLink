package edu.cit.ceniza.mobile.features.profile

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PUT
import retrofit2.http.Path

interface ProfileService {

    @GET("api/users/profile/{id}")
    fun getResidentProfile(
        @Path("id") userId: Int,
        @Header("Authorization") token: String
    ): Call<ResidentProfile>

    @PUT("api/users/profile")
    fun updateResidentProfile(
        @Header("Authorization") token: String,
        @Body updatedProfile: ResidentProfile
    ): Call<Void>
}