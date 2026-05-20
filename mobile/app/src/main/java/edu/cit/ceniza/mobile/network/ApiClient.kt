package edu.cit.ceniza.mobile.network

import edu.cit.ceniza.mobile.BuildConfig
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {

    private const val LOCAL_URL = "http://10.0.2.2:8080/"
    private const val LIVE_URL  = "https://bayanlink-api.onrender.com/"
    private val BASE_URL = if (BuildConfig.DEBUG) LOCAL_URL else LIVE_URL

    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}