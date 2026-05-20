package edu.cit.ceniza.mobile.features.notifications

import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.appbar.MaterialToolbar
import edu.cit.ceniza.mobile.R
import edu.cit.ceniza.mobile.network.ApiClient
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class NotificationActivity : AppCompatActivity() {

    private lateinit var rvNotifications: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyStateLayout: LinearLayout
    private lateinit var toolbar: MaterialToolbar
    private val currentUserId = 1
    private val currentToken = "Bearer YOUR_SAVED_TOKEN"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notification)
        rvNotifications = findViewById(R.id.rvNotifications)
        progressBar = findViewById(R.id.progressBar)
        emptyStateLayout = findViewById(R.id.emptyStateLayout)
        toolbar = findViewById(R.id.toolbar)
        toolbar.setNavigationOnClickListener { finish() }
        rvNotifications.layoutManager = LinearLayoutManager(this)

        fetchNotifications()
    }

    private fun fetchNotifications() {
        progressBar.visibility = View.VISIBLE
        rvNotifications.visibility = View.GONE
        emptyStateLayout.visibility = View.GONE

        val service = ApiClient.instance.create(NotificationService::class.java)

        lifecycleScope.launch {
            try {
                val docsDeferred = async { service.getUserDocuments(currentToken, currentUserId) }
                val apptsDeferred = async { service.getUserAppointments(currentToken, currentUserId) }
                val docsResponse = docsDeferred.await()
                val apptsResponse = apptsDeferred.await()
                val alerts = mutableListOf<NotificationAlert>()

                if (docsResponse.isSuccessful) {
                    val docsList = docsResponse.body() ?: emptyList()
                    for (doc in docsList) {
                        if (doc.status == "READY_FOR_PICKUP" || doc.status == "REJECTED") {
                            val type = if (doc.status == "READY_FOR_PICKUP") NotificationType.SUCCESS else NotificationType.ERROR
                            val title = if (type == NotificationType.SUCCESS) "Document Ready" else "Document Rejected"
                            val msg = if (type == NotificationType.SUCCESS)
                                "Your request for ${doc.documentType} has been processed!"
                            else "Your request for ${doc.documentType} was rejected."

                            alerts.add(NotificationAlert("doc-${doc.requestId}", title, msg, type, doc.requestDate?.toString() ?: "Recently"))
                        }
                    }
                }

                if (apptsResponse.isSuccessful) {
                    val apptsList = apptsResponse.body() ?: emptyList()
                    for (appt in apptsList) {
                        if (appt.status == "APPROVED" || appt.status == "REJECTED") {
                            val type = if (appt.status == "APPROVED") NotificationType.SUCCESS else NotificationType.ERROR
                            val title = if (type == NotificationType.SUCCESS) "Appointment Approved" else "Appointment Rejected"
                            val msg = if (type == NotificationType.SUCCESS)
                                "Your appointment is confirmed and scheduled."
                            else "Your appointment request was declined."

                            alerts.add(NotificationAlert("appt-${appt.id}", title, msg, type, appt.appointmentDate ?: "Recently"))
                        }
                    }
                }

                progressBar.visibility = View.GONE
                if (alerts.isEmpty()) {
                    emptyStateLayout.visibility = View.VISIBLE
                } else {
                    rvNotifications.visibility = View.VISIBLE
                    alerts.sortByDescending { it.id }
                }

            } catch (e: Exception) {
                progressBar.visibility = View.GONE
                Toast.makeText(this@NotificationActivity, "Network error fetching notifications", Toast.LENGTH_SHORT).show()
            }
        }
    }
}