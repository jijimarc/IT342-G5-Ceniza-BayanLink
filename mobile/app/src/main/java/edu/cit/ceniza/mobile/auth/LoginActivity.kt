package edu.cit.ceniza.mobile.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginActivity : AppCompatActivity() {
    private lateinit var sessionManager: SessionManager
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        sessionManager = SessionManager(this)
        val etEmail = findViewById<EditText>(R.id.etEmail)
        val etPassword = findViewById<EditText>(R.id.etPassword)
        val btnSubmitSignIn = findViewById<Button>(R.id.btnSubmitSignIn)
        val tvRegisterFooterLink = findViewById<TextView>(R.id.tvRegisterFooterLink)
        val authService = edu.cit.ceniza.mobile.network.ApiClient.instance.create(AuthService::class.java)

        btnSubmitSignIn.setOnClickListener {
            val emailText = etEmail.text.toString().trim()
            val passwordText = etPassword.text.toString().trim()

            if (emailText.isEmpty() || passwordText.isEmpty()) {
                Toast.makeText(this, "Please fulfill all input fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!emailText.endsWith("@gmail.com")) {
                Toast.makeText(this, "Only @gmail.com addresses are allowed.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            btnSubmitSignIn.isEnabled = false
            btnSubmitSignIn.text = "Signing in..."

            val requestPayload = LoginRequest(emailText, passwordText)

            authService.loginUser(requestPayload).enqueue(object : Callback<LoginResponse> {
                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                    btnSubmitSignIn.isEnabled = true
                    btnSubmitSignIn.text = "Sign In"

                    if (response.isSuccessful) {
                        val loginResponse = response.body()

                        if (loginResponse != null) {
                            val token = loginResponse.token ?: ""
                            val userId = loginResponse.userId ?: -1L
                            val firstname = loginResponse.userFirstname ?: ""
                            val lastname = loginResponse.userLastname ?: ""
                            val combinedFullName = "$firstname $lastname".trim()

                            sessionManager.saveAuthToken(token)
                            sessionManager.saveUserId(userId)

                            if (combinedFullName.isNotEmpty()) {
                                sessionManager.saveFullName(combinedFullName)
                            } else {
                                val email = loginResponse.userEmail ?: "Resident User"
                                sessionManager.saveFullName(email)
                            }

                            val intent = Intent(this@LoginActivity, DashboardActivity::class.java)
                            startActivity(intent)
                            finish()
                        }
                    }
                }

                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    btnSubmitSignIn.isEnabled = true
                    btnSubmitSignIn.text = "Sign In"

                    Toast.makeText(this@LoginActivity, "Network Error: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
        }

        tvRegisterFooterLink.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}