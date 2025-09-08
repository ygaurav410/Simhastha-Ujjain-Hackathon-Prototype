// Global state management for cross-panel synchronization
import { EmergencyPost, EmergencyReport, Alert, User } from '../types';

// Global state store
class GlobalStateManager {
  private emergencyPosts: EmergencyPost[] = [];
  private emergencyReports: EmergencyReport[] = [];
  private alerts: Alert[] = [];
  private listeners: { [key: string]: Function[] } = {};

  // Subscribe to state changes
  subscribe(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Unsubscribe from state changes
  unsubscribe(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit state changes
  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Emergency Posts Management
  addEmergencyPost(post: EmergencyPost) {
    this.emergencyPosts.unshift(post);
    this.emit('emergencyPostAdded', post);
    this.emit('emergencyPostsUpdated', this.emergencyPosts);
  }

  updateEmergencyPost(postId: string, updates: Partial<EmergencyPost>) {
    const index = this.emergencyPosts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.emergencyPosts[index] = { ...this.emergencyPosts[index], ...updates };
      this.emit('emergencyPostUpdated', this.emergencyPosts[index]);
      this.emit('emergencyPostsUpdated', this.emergencyPosts);
    }
  }

  getEmergencyPosts(): EmergencyPost[] {
    return [...this.emergencyPosts];
  }

  setEmergencyPosts(posts: EmergencyPost[]) {
    this.emergencyPosts = posts;
    this.emit('emergencyPostsUpdated', this.emergencyPosts);
  }

  // Emergency Reports Management
  addEmergencyReport(report: EmergencyReport) {
    this.emergencyReports.unshift(report);
    this.emit('emergencyReportAdded', report);
    this.emit('emergencyReportsUpdated', this.emergencyReports);
  }

  updateEmergencyReport(reportId: string, updates: Partial<EmergencyReport>) {
    const index = this.emergencyReports.findIndex(r => r.id === reportId);
    if (index !== -1) {
      this.emergencyReports[index] = { ...this.emergencyReports[index], ...updates };
      this.emit('emergencyReportUpdated', this.emergencyReports[index]);
      this.emit('emergencyReportsUpdated', this.emergencyReports);
    }
  }

  getEmergencyReports(): EmergencyReport[] {
    return [...this.emergencyReports];
  }

  setEmergencyReports(reports: EmergencyReport[]) {
    this.emergencyReports = reports;
    this.emit('emergencyReportsUpdated', this.emergencyReports);
  }

  // Alerts Management
  addAlert(alert: Alert) {
    this.alerts.unshift(alert);
    this.emit('alertAdded', alert);
    this.emit('alertsUpdated', this.alerts);
  }

  updateAlert(alertId: string, updates: Partial<Alert>) {
    const index = this.alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      this.alerts[index] = { ...this.alerts[index], ...updates };
      this.emit('alertUpdated', this.alerts[index]);
      this.emit('alertsUpdated', this.alerts);
    }
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  setAlerts(alerts: Alert[]) {
    this.alerts = alerts;
    this.emit('alertsUpdated', this.alerts);
  }

  // Convert emergency post to emergency report (for admin/authority view)
  convertPostToReport(post: EmergencyPost): EmergencyReport {
    return {
      id: post.id,
      type: post.type,
      description: post.description,
      location: post.location,
      reportedBy: `${post.userName} (${post.contact || 'No contact'})`,
      status: post.status === 'active' ? 'reported' : 'resolved',
      priority: post.priority,
      timestamp: post.timestamp,
      assignedTo: undefined,
    };
  }

  // Sync emergency posts to reports for admin/authority panels
  syncPostsToReports() {
    const reports = this.emergencyPosts.map(post => this.convertPostToReport(post));
    this.setEmergencyReports([...reports, ...this.emergencyReports.filter(r => 
      !this.emergencyPosts.some(p => p.id === r.id)
    )]);
  }
}

// Create global instance
export const globalState = new GlobalStateManager();

// Initialize with mock data
import { mockEmergencyPosts, mockEmergencyReports, mockAlerts } from './mockData';

globalState.setEmergencyPosts(mockEmergencyPosts);
globalState.setEmergencyReports(mockEmergencyReports);
globalState.setAlerts(mockAlerts);
globalState.syncPostsToReports();