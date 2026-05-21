package edu.cit.ceniza.mobile.features.profile

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.annotation.RequiresApi
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.auth.LoginActivity
import edu.cit.ceniza.mobile.features.dashboard.DashboardActivity
import edu.cit.ceniza.mobile.features.appointment.AppointmentActivity
import edu.cit.ceniza.mobile.features.document.DocumentActivity
import edu.cit.ceniza.mobile.auth.SessionManager
import edu.cit.ceniza.mobile.features.notifications.NotificationActivity
import edu.cit.ceniza.mobile.network.ApiClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileActivity : AppCompatActivity() {

    private lateinit var drawerLayout: DrawerLayout
    private var isEditMode = false
    private lateinit var etFirstName: EditText
    private lateinit var etMiddleName: EditText
    private lateinit var etLastName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etContact: EditText
    private lateinit var etBirthdate: EditText
    private lateinit var etAge: EditText
    private lateinit var etAddress: EditText
    private lateinit var etCivilStatus: EditText
    private lateinit var etOccupation: EditText
    private lateinit var etVoterStatus: EditText
    private lateinit var btnEditProfile: Button
    private lateinit var btnCancelEdit: Button
    private var cachedProfile: ResidentProfile? = null
    private lateinit var sessionManager: SessionManager
    private lateinit var navigationView: NavigationView
    override fun onResume() {
        super.onResume()
        if (::navigationView.isInitialized) {
            navigationView.setCheckedItem(R.id.nav_profile)
        }
    }
    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)
        sessionManager = SessionManager(this)
        bindViews()
        setupDrawerNavigation()
        val profileService = ApiClient.instance.create(ProfileService::class.java)
        fetchProfileData(profileService)
        etAge.isEnabled = false
        etBirthdate.setFocusable(false)
        etBirthdate.setOnClickListener {
            if (isEditMode) {
                val calendar = java.util.Calendar.getInstance()
                val datePickerDialog = android.app.DatePickerDialog(this, { _, year, month, day ->
                    val cleanDateString = String.format("%04d-%02d-%02d", year, month + 1, day)
                    etBirthdate.setText(cleanDateString)

                    val computedAge = java.time.Period.between(
                        java.time.LocalDate.of(year, month + 1, day),
                        java.time.LocalDate.now()
                    ).years
                    etAge.setText(computedAge.toString())
                }, calendar.get(java.util.Calendar.YEAR), calendar.get(java.util.Calendar.MONTH), calendar.get(java.util.Calendar.DAY_OF_MONTH))
                datePickerDialog.show()
            }
        }

        btnEditProfile.setOnClickListener {
            if (!isEditMode) toggleEditMode(true) else saveProfileData(profileService)
        }
        btnCancelEdit.setOnClickListener {
            toggleEditMode(false)
            cachedProfile?.let { populateFields(it) }
        }
    }

    private fun bindViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        etFirstName = findViewById(R.id.etFirstName)
        etMiddleName = findViewById(R.id.etMiddleName)
        etLastName = findViewById(R.id.etLastName)
        etEmail = findViewById(R.id.etEmail)
        etContact = findViewById(R.id.etContact)
        etBirthdate = findViewById(R.id.etBirthdate)
        etAge = findViewById(R.id.etAge)
        etAddress = findViewById(R.id.etAddress)
        etCivilStatus = findViewById(R.id.etCivilStatus)
        etOccupation = findViewById(R.id.etOccupation)
        etVoterStatus = findViewById(R.id.etVoterStatus)
        btnEditProfile = findViewById(R.id.btnEditProfile)
        btnCancelEdit = findViewById(R.id.btnCancelEdit)
    }

    private fun populateFields(profile: ResidentProfile) {
        etFirstName.setText(profile.userFirstname ?: "")
        etMiddleName.setText(profile.userMiddlename ?: "")
        etLastName.setText(profile.userLastname ?: "")
        etEmail.setText(profile.userEmail ?: "")
        etContact.setText(profile.contactNumber ?: "")
        etBirthdate.setText(profile.userBirthdate ?: "")
        etAge.setText(profile.age?.toString() ?: "")
        etAddress.setText(profile.address ?: "")
        etCivilStatus.setText(profile.civilStatus ?: "")
        etOccupation.setText(profile.occupation ?: "")
        etVoterStatus.setText(profile.voterStatus ?: "")
    }

    private fun toggleEditMode(enable: Boolean) {
        isEditMode = enable

        etFirstName.isEnabled = enable
        etMiddleName.isEnabled = enable
        etLastName.isEnabled = enable
        etContact.isEnabled = enable
        etBirthdate.isEnabled = enable
        etAge.isEnabled = enable
        etAddress.isEnabled = enable
        etCivilStatus.isEnabled = enable
        etOccupation.isEnabled = enable
        etVoterStatus.isEnabled = enable
        etEmail.isEnabled = false

        if (enable) {
            btnEditProfile.text = "Save Changes"
            btnEditProfile.setBackgroundColor(android.graphics.Color.parseColor("#10B981"))
            btnCancelEdit.visibility = android.view.View.VISIBLE
        } else {
            btnEditProfile.text = "Edit Profile"
            btnEditProfile.setBackgroundColor(android.graphics.Color.parseColor("#3B82F6"))
            btnCancelEdit.visibility = android.view.View.GONE
        }
    }

    private fun fetchProfileData(service: ProfileService) {
        val userId = sessionManager.fetchUserId().toInt()
        val token = sessionManager.fetchAuthToken()

        if (userId == -1 || token == null) return

        service.getResidentProfile(userId, "Bearer $token").enqueue(object : Callback<ResidentProfile> {
            override fun onResponse(call: Call<ResidentProfile>, response: Response<ResidentProfile>) {
                if (response.isSuccessful && response.body() != null) {
                    val profile = response.body()!!
                    cachedProfile = profile
                    populateFields(profile)
                }
            }
            override fun onFailure(call: Call<ResidentProfile>, t: Throwable) {
                Toast.makeText(this@ProfileActivity, "Failed to load profile", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun saveProfileData(service: ProfileService) {
        val userId = sessionManager.fetchUserId().toInt()
        val token = sessionManager.fetchAuthToken()
        if (userId == -1 || token == null) return

        btnEditProfile.isEnabled = false
        btnEditProfile.text = "Saving..."

        val updatedData = ResidentProfile(
            userId = userId,
            userFirstname = etFirstName.text.toString().trim(),
            userMiddlename = etMiddleName.text.toString().trim(),
            userLastname = etLastName.text.toString().trim(),
            userEmail = etEmail.text.toString().trim(),
            contactNumber = etContact.text.toString().trim(),
            userBirthdate = etBirthdate.text.toString().trim(),
            age = etAge.text.toString().toIntOrNull(),
            address = etAddress.text.toString().trim(),
            civilStatus = etCivilStatus.text.toString().trim(),
            occupation = etOccupation.text.toString().trim(),
            voterStatus = etVoterStatus.text.toString().trim()
        )

        service.updateResidentProfile("Bearer $token", updatedData).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                btnEditProfile.isEnabled = true
                if (response.isSuccessful) {
                    Toast.makeText(this@ProfileActivity, "Profile Updated Successfully!", Toast.LENGTH_SHORT).show()
                    cachedProfile = updatedData
                    toggleEditMode(false)
                    fetchProfileData(service)
                } else {
                    val errorDetails = response.errorBody()?.string() ?: ""
                    android.util.Log.e("ProfileSaveError", "Server rejected payload: $errorDetails")
                    Toast.makeText(this@ProfileActivity, "Update Failed: Check Logcat", Toast.LENGTH_SHORT).show()
                    toggleEditMode(true)
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {
                btnEditProfile.isEnabled = true
                Toast.makeText(this@ProfileActivity, "Network Error", Toast.LENGTH_SHORT).show()
                toggleEditMode(true)
            }
        })
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
            overrideActivityTransition(AppCompatActivity.OVERRIDE_TRANSITION_OPEN, 0, 0)
        } else {
            @Suppress("DEPRECATION")
            overridePendingTransition(0, 0)
        }
    }
}