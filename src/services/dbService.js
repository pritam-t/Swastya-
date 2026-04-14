// ============================================
// LOCAL DATABASE SERVICE (localStorage)
// Replace with real DB (Supabase, Firebase) later
// ============================================

const KEYS = {
  PROFILE:      'swastya_profile',
  MEAL_LOG:     'swastya_meal_log',
  HEALTH_TRENDS:'swastya_health_trends',
};

export const dbService = {
  // -------- Clinical Profile --------
  saveProfile(profileData) {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profileData));
  },
  getProfile() {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  },
  clearProfile() {
    localStorage.removeItem(KEYS.PROFILE);
  },

  // -------- Meal Log --------
  addMealLog(entry) {
    const logs = this.getMealLogs();
    const newEntry = { ...entry, id: Date.now(), loggedAt: new Date().toISOString() };
    logs.push(newEntry);
    localStorage.setItem(KEYS.MEAL_LOG, JSON.stringify(logs));
    return newEntry;
  },
  getMealLogs() {
    const raw = localStorage.getItem(KEYS.MEAL_LOG);
    return raw ? JSON.parse(raw) : [];
  },
  clearMealLogs() {
    localStorage.removeItem(KEYS.MEAL_LOG);
  },

  // -------- Health Trends --------
  saveHealthTrend(trendData) {
    const trends = this.getHealthTrends();
    const entry = { ...trendData, date: new Date().toISOString().split('T')[0] };
    // Update or add today's entry
    const idx = trends.findIndex(t => t.date === entry.date);
    if (idx >= 0) { trends[idx] = entry; } else { trends.push(entry); }
    localStorage.setItem(KEYS.HEALTH_TRENDS, JSON.stringify(trends));
  },
  getHealthTrends() {
    const raw = localStorage.getItem(KEYS.HEALTH_TRENDS);
    return raw ? JSON.parse(raw) : [];
  },

  // -------- Clear All Data --------
  clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
};
