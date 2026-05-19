package edu.cit.ceniza.mobile.features.document

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.auth.LoginActivity
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import edu.cit.ceniza.mobile.features.profile.ProfileActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class DocumentActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout

    private lateinit var etDocFullName: EditText
    private lateinit var spinnerDocType: Spinner
    private lateinit var spinnerUrgency: Spinner
    private lateinit var spinnerValidId: Spinner
    private lateinit var btnChooseFile: Button
    private lateinit var tvFileName: TextView
    private lateinit var etDocPurpose: EditText
    private lateinit var btnRemoveRequest: Button
    private lateinit var btnSubmitRequest: Button

    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if (uri != null) {
            tvFileName.text = "ID_Selected.jpg"
            tvFileName.setTextColor(android.graphics.Color.parseColor("#10B981"))
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_document)

        bindViews()
        setupDrawerNavigation()

        btnChooseFile.setOnClickListener {
            pickImageLauncher.launch("image/*")
        }

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8080/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        val documentService = retrofit.create(DocumentService::class.java)

        btnRemoveRequest.setOnClickListener {
            clearForm()
        }

        btnSubmitRequest.setOnClickListener {
            submitForm(documentService)
        }
    }

    private fun bindViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        etDocFullName = findViewById(R.id.etDocFullName)
        spinnerDocType = findViewById(R.id.spinnerDocType)
        spinnerUrgency = findViewById(R.id.spinnerUrgency)
        spinnerValidId = findViewById(R.id.spinnerValidId)
        btnChooseFile = findViewById(R.id.btnChooseFile)
        tvFileName = findViewById(R.id.tvFileName)
        etDocPurpose = findViewById(R.id.etDocPurpose)
        btnRemoveRequest = findViewById(R.id.btnRemoveRequest)
        btnSubmitRequest = findViewById(R.id.btnSubmitRequest)
    }

    private fun submitForm(service: DocumentService) {
        val docType = spinnerDocType.selectedItem.toString()
        val urgency = spinnerUrgency.selectedItem.toString()
        val validId = spinnerValidId.selectedItem.toString()
        val purpose = etDocPurpose.text.toString().trim()

        if (docType.contains("Select") || urgency.contains("Select") || validId.contains("Select")) {
            Toast.makeText(this, "Please select options from all dropdowns.", Toast.LENGTH_SHORT).show()
            return
        }
        if (purpose.isEmpty()) {
            Toast.makeText(this, "Please state the purpose of your request.", Toast.LENGTH_SHORT).show()
            return
        }
        if (tvFileName.text == "No file chosen") {
            Toast.makeText(this, "Please upload a Valid ID.", Toast.LENGTH_SHORT).show()
            return
        }

        val requestData = DocumentRequestPayload(
            fullName = etDocFullName.text.toString(),
            documentType = docType,
            urgencyLevel = urgency,
            validIdType = validId,
            purpose = purpose
        )

        btnSubmitRequest.isEnabled = false
        btnSubmitRequest.text = "Submitting..."

        val testUserId = 1L
        val testToken = "Bearer placeholder"

        service.submitDocumentRequest(testUserId, testToken, requestData).enqueue(object : Callback<DocumentResponse> {
            override fun onResponse(call: Call<DocumentResponse>, response: Response<DocumentResponse>) {
                btnSubmitRequest.isEnabled = true
                btnSubmitRequest.text = "Submit"

                if (response.isSuccessful) {
                    Toast.makeText(this@DocumentActivity, "Document Requested Successfully!", Toast.LENGTH_LONG).show()
                    clearForm()
                } else {
                    Toast.makeText(this@DocumentActivity, "Failed to submit request.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<DocumentResponse>, t: Throwable) {
                btnSubmitRequest.isEnabled = true
                btnSubmitRequest.text = "Submit"
                Toast.makeText(this@DocumentActivity, "Network Error", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun clearForm() {
        spinnerDocType.setSelection(0)
        spinnerUrgency.setSelection(0)
        spinnerValidId.setSelection(0)
        etDocPurpose.text.clear()
        tvFileName.text = "No file chosen"
        tvFileName.setTextColor(android.graphics.Color.parseColor("#94A3B8")) // Reset to default gray
    }

    private fun setupDrawerNavigation() {
        val toolbar = findViewById<Toolbar>(R.id.topToolbar)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav)
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        val navigationView = findViewById<NavigationView>(R.id.navigationView)

        navigationView.setCheckedItem(R.id.nav_documents)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> {
                    val intent = Intent(this, DashboardActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    startActivity(intent)
                }
                R.id.nav_documents -> {
                    // Current page
                }
                R.id.nav_profile -> {
                    val intent = Intent(this, ProfileActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    startActivity(intent)
                }
                R.id.nav_logout -> {
                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
            true
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
                    drawerLayout.closeDrawer(GravityCompat.START)
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }
}