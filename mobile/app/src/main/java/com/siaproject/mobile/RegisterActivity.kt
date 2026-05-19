package com.siaproject.mobile

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class RegisterActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val userEmail = findViewById<EditText>(R. id. etEmail)
        val userPassword = findViewById<EditText>(R. id. etPass)
        val confirmPassword = findViewById<EditText>(R. id. etConfirmPass)

        val btnCancel = findViewById<Button>(R.id.cancelButton)
        btnCancel.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }

        val btnRegister = findViewById<Button>(R.id.signUpButton)
        btnRegister.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }
}