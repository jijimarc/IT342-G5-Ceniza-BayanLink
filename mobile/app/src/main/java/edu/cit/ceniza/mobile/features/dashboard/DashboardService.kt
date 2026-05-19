package edu.cit.ceniza.mobile.features.dashboard

import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path

interface DashboardService {

    @GET("api/resident/{userId}/dashboard")
    fun getResidentDashboard(
        @Path("userId") userId: Long,
        @Header("Authorization") bearerToken: String
    ): Call<DashboardSummaryResponse>

}