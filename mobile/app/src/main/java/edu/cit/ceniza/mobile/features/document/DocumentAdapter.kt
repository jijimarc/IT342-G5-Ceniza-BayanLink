package edu.cit.ceniza.mobile.features.document

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import edu.cit.ceniza.mobile.R
import java.util.Locale

class DocumentAdapter(private val documents: List<PendingDocument>) :
    RecyclerView.Adapter<DocumentAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val tvType: TextView = view.findViewById(R.id.tvDocType)
        val tvStatus: TextView = view.findViewById(R.id.tvStatus)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_document, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val doc = documents[position]
        val context = holder.itemView.context
        holder.tvType.text = doc.documentType
        val rawStatus = doc.status ?: "UNKNOWN"
        holder.tvStatus.text = rawStatus.replace("_", " ")

        when (rawStatus.uppercase(Locale.getDefault())) {
            "REJECTED" -> {
                holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.status_error_red))
            }
            "READY_FOR_PICKUP", "APPROVED" -> {
                holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.status_success_green))
            }
            "PENDING", "PENDING_APPROVAL" -> {
                holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.status_warning_orange))
            }
            else -> {
                holder.tvStatus.setTextColor(ContextCompat.getColor(context, R.color.text_muted_blue_slate))
            }
        }
    }

    override fun getItemCount() = documents.size
}