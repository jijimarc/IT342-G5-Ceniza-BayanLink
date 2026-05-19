package edu.cit.ceniza.mobile.features.profile

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PUT
import retrofit2.http.Path

interface ProfileService {

    @GET("api/resident/{userId}/profile")
    fun getResidentProfile(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String
    ): Call<ResidentProfile>

    @PUT("api/resident/{userId}/profile")
    fun updateResidentProfile(
        @Path("userId") userId: Long,
        @Header("Authorization") token: String,
        @Body updatedProfile: ResidentProfile
    ): Call<ProfileUpdateResponse>
}