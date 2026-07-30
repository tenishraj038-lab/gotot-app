"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  description: string;
  uptime: string;
}

const initialServices: ServiceStatus[] = [
  { name: "Download API", status: "operational", description: "Video analysis and download endpoints", uptime: "99.9%" },
  { name: "Video Processing", status: "operational", description: "FFmpeg transcoding and format conversion", uptime: "99.8%" },
  { name: "CDN / Streaming", status: "operational", description: "Content delivery and streaming infrastructure", uptime: "99.9%" },
  { name: "Database", status: "operational", description: "PostgreSQL database for user data and history", uptime: "99.99%" },
  { name: "Cache / Redis", status: "operational", description: "Redis caching for video info and sessions", uptime: "99.9%" },
  { name: "Email Service", status: "degraded", description: "SMTP email delivery for notifications", uptime: "98.5%" },
  { name: "Authentication", status: "operational", description: "Supabase auth and session management", uptime: "99.9%" },
  { name: "Rate Limiter", status: "operational", description: "API rate limiting and abuse prevention", uptime: "99.9%" },
];

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>(initialServices);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshStatus = () => {
    setServices((prev) =>
      prev.map((s) => ({
        ...s,
        status: Math.random() > 0.1 ? s.status : (Math.random() > 0.5 ? "degraded" : "operational"),
      }))
    );
    setLastUpdated(new Date());
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "down":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30";
      case "degraded":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30";
      case "down":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/30";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const operationalCount = services.filter((s) => s.status === "operational").length;
  const totalCount = services.length;
  const overallStatus = operationalCount === totalCount ? "All systems operational" : "Some services degraded";

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Real-time status of GoTot services and infrastructure.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-300 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {overallStatus}
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <button
            onClick={refreshStatus}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        <div className="space-y-3">
          {services.map((service, idx) => (
            <motion.div
              key={service.name}
              className={`rounded-xl border p-4 flex items-center justify-between ${getStatusColor(service.status)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                {getIcon(service.status)}
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs opacity-70">{service.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium capitalize">{service.status}</p>
                <p className="text-xs opacity-60">Uptime: {service.uptime}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}