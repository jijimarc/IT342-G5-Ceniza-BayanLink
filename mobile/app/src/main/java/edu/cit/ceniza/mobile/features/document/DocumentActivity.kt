package edu.cit.ceniza.mobile.features.document

import android.content.Intent
import android.net.Uri
import android.os.Build
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
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.auth.LoginActivity
import edu.cit.ceniza.mobile.auth.SessionManager
import edu.cit.ceniza.mobile.features.appointment.AppointmentActivity
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import edu.cit.ceniza.mobile.features.notifications.NotificationActivity
import edu.cit.ceniza.mobile.features.profile.ProfileActivity
import edu.cit.ceniza.mobile.network.ApiClient
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import okhttp3.MediaType
class DocumentActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var sessionManager: SessionManager
    private var selectedImageUri: Uri? = null
    private lateinit var etDocFullName: EditText
    private lateinit var spinnerDocType: Spinner
    private lateinit var spinnerUrgency: Spinner
    private lateinit var spinnerValidId: Spinner
    private lateinit var btnChooseFile: Button
    private lateinit var tvFileName: TextView
    private lateinit var etDocPurpose: EditText
    private lateinit var btnRemoveRequest: Button
    private lateinit var btnSubmitRequest: Button
    private lateinit var navigationView: NavigationView
    override fun onResume() {
        super.onResume()
        if (::navigationView.isInitialized) {
            navigationView.setCheckedItem(R.id.nav_documents)
        }
    }
    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if (uri != null) {
            selectedImageUri = uri
            tvFileName.text = "ID_Selected.jpg"
            tvFileName.setTextColor(android.graphics.Color.parseColor("#10B981"))
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_document)
        val documentService = ApiClient.instance.create(DocumentService::class.java)
        sessionManager = SessionManager(this)

        bindViews()
        val cachedResidentName = sessionManager.fetchFullName()
        if (!cachedResidentName.isNullOrEmpty()) {
            etDocFullName.setText(cachedResidentName)
        } else {
            etDocFullName.setText("Resident Profile")
        }
        setupDrawerNavigation()
        fetchDocumentData(documentService)

        btnChooseFile.setOnClickListener {
            pickImageLauncher.launch("image/*")
        }

        btnRemoveRequest.setOnClickListener { clearForm() }
        btnSubmitRequest.setOnClickListener { submitForm(documentService) }
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

    private fun createFormDataPart(key: String, value: String): MultipartBody.Part {
        return MultipartBody.Part.createFormData(key, value)
    }

    private fun fetchDocumentData(service: DocumentService) {
        val userId = sessionManager.fetchUserId()
        val token = sessionManager.fetchAuthToken() ?: return

        service.getResidentDocuments(userId, "Bearer $token").enqueue(object : Callback<List<PendingDocument>> {
            override fun onResponse(call: Call<List<PendingDocument>>, response: Response<List<PendingDocument>>) {
                if (response.isSuccessful) {
                    val allDocs = response.body() ?: emptyList()
                    allDocs.forEach { doc ->
                        android.util.Log.d("DocStatusDebug", "Type: ${doc.documentType} | Status: ${doc.status}")
                    }
                    val pending = allDocs.filter { it.status.contains("PENDING", ignoreCase = true) }

                    val history = allDocs.filter {
                        !it.status.contains("PENDING", ignoreCase = true)
                    }

                    val rvPending = findViewById<RecyclerView>(R.id.rvPendingDocuments)
                    rvPending.layoutManager = LinearLayoutManager(this@DocumentActivity)
                    rvPending.adapter = DocumentAdapter(pending)

                    val rvHistory = findViewById<RecyclerView>(R.id.rvHistoryDocuments)
                    rvHistory.layoutManager = LinearLayoutManager(this@DocumentActivity)
                    rvHistory.adapter = DocumentAdapter(history)
                }
            }
            override fun onFailure(call: Call<List<PendingDocument>>, t: Throwable) {
                Toast.makeText(this@DocumentActivity, "Failed to load docs", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun submitForm(service: DocumentService) {
        val fullName = etDocFullName.text.toString().trim()
        val docType = spinnerDocType.selectedItem.toString()
        val urgency = spinnerUrgency.selectedItem.toString()
        val validId = spinnerValidId.selectedItem.toString()
        val purpose = etDocPurpose.text.toString().trim()

        if (docType.contains("Select") || urgency.contains("Select") || validId.contains("Select")) {
            Toast.makeText(this, "Please select options from all dropdowns.", Toast.LENGTH_SHORT).show()
            return
        }
        if (fullName.isEmpty() || purpose.isEmpty()) {
            Toast.makeText(this, "Please fill out all text fields.", Toast.LENGTH_SHORT).show()
            return
        }
        if (selectedImageUri == null) {
            Toast.makeText(this, "Please upload a Valid ID.", Toast.LENGTH_SHORT).show()
            return
        }

        val userId = sessionManager.fetchUserId()
        val token = sessionManager.fetchAuthToken()

        if (userId == -1L || token == null) {
            Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_SHORT).show()
            return
        }

        btnSubmitRequest.isEnabled = false
        btnSubmitRequest.text = "Uploading..."

        val inputStream = contentResolver.openInputStream(selectedImageUri!!)
        val imageBytes = inputStream?.readBytes() ?: ByteArray(0)
        val requestFile = RequestBody.create(MediaType.parse("image/jpeg"), imageBytes)
        val imagePart = MultipartBody.Part.createFormData("idImage", "upload.jpg", requestFile)

        service.submitDocumentRequest(
            token = "Bearer $token",
            userId = createFormDataPart("userId", userId.toString()),
            fullName = createFormDataPart("fullName", fullName),
            documentType = createFormDataPart("documentType", docType),
            validId = createFormDataPart("validId", validId),
            purpose = createFormDataPart("purpose", purpose),
            urgencyLevel = createFormDataPart("urgencyLevel", urgency),
            idImage = imagePart
        ).enqueue(object : Callback<PendingDocument> {
            override fun onResponse(call: Call<PendingDocument>, response: Response<PendingDocument>) {
                btnSubmitRequest.isEnabled = true
                btnSubmitRequest.text = "Submit"

                if (response.isSuccessful) {
                    Toast.makeText(this@DocumentActivity, "Document Requested Successfully!", Toast.LENGTH_LONG).show()
                    clearForm()
                    fetchDocumentData(service)
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Code: ${response.code()}"
                    Toast.makeText(this@DocumentActivity, "Upload failed. Error: $errorMsg", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<PendingDocument>, t: Throwable) {
                btnSubmitRequest.isEnabled = true
                btnSubmitRequest.text = "Submit"
                Toast.makeText(this@DocumentActivity, "Network Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun clearForm() {
        etDocFullName.text.clear()
        spinnerDocType.setSelection(0)
        spinnerUrgency.setSelection(0)
        spinnerValidId.setSelection(0)
        etDocPurpose.text.clear()
        selectedImageUri = null
        tvFileName.text = "No file chosen"
        tvFileName.setTextColor(android.graphics.Color.parseColor("#94A3B8"))
    }

    private fun setupDrawerNavigation() {
        val toolbar = findViewById<Toolbar>(R.id.topToolbar)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.open_nav, R.string.close_nav)
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        navigationView = findViewById(R.id.navigationView)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_dashboard -> { navigateTo(DashboardActivity::class.java) }
                R.id.nav_appointments -> { navigateTo(AppointmentActivity::class.java) }
                R.id.nav_documents -> { navigateTo(DocumentActivity::class.java) }
                R.id.nav_profile -> { navigateTo(ProfileActivity::class.java) }
                R.id.nav_notifications -> { navigateTo(NotificationActivity::class.java) }
                R.id.nav_logout -> {
                    sessionManager.clearSession()
                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
            true
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (drawerLayout.isDrawerOpen(GravityCompat.START)) drawerLayout.closeDrawer(GravityCompat.START)
                else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    private fun navigateTo(activityClass: Class<*>) {
        drawerLayout.closeDrawer(GravityCompat.START)

        if (this::class.java == activityClass) return

        val intent = Intent(this, activityClass)
        intent.flags = Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
        startActivity(intent)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            overrideActivityTransition(
                AppCompatActivity.OVERRIDE_TRANSITION_OPEN,
                0,
                0
            )
        } else {
            @Suppress("DEPRECATION")
            overridePendingTransition(0, 0)
        }
    }
}