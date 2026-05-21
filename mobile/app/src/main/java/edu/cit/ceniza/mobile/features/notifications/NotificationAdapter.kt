package edu.cit.ceniza.mobile.features.notifications

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import edu.cit.ceniza.mobile.R

class NotificationAdapter(private val alerts: List<NotificationAlert>) :
    RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvTitle: TextView = view.findViewById(R.id.tvAlertTitle)
        val tvMessage: TextView = view.findViewById(R.id.tvAlertMessage)
        val tvDate: TextView = view.findViewById(R.id.tvAlertDate)
        val ivIcon: ImageView = view.findViewById(R.id.ivAlertIcon)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_notification, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val alert = alerts[position]
        holder.tvTitle.text = alert.title
        holder.tvMessage.text = alert.message
        holder.tvDate.text = alert.date

        val context = holder.itemView.context
        if (alert.type == NotificationType.SUCCESS) {
            holder.tvTitle.setTextColor(ContextCompat.getColor(context, R.color.status_success_green))
            holder.ivIcon.setImageResource(R.drawable.ic_check_circle)
        } else {
            holder.tvTitle.setTextColor(ContextCompat.getColor(context, R.color.status_error_red))
            holder.ivIcon.setImageResource(R.drawable.ic_error_outline)
        }
    }

    override fun getItemCount() = alerts.size
}