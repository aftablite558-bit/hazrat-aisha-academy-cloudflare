export const perfTracker = {
  authStart: 0,
  authTime: 0,
  profileFetchStart: 0,
  profileFetchTime: 0,
  dashboardInitStart: 0,
  dashboardLoadTime: 0,
  firestoreReads: 0,
  duplicateQueries: 0,
  queryLog: new Set<string>(),

  startAuth() {
    this.authStart = performance.now();
  },
  endAuth() {
    if (this.authStart > 0) {
      this.authTime = performance.now() - this.authStart;
    }
  },

  startProfileFetch() {
    this.profileFetchStart = performance.now();
  },
  endProfileFetch() {
    if (this.profileFetchStart > 0) {
      this.profileFetchTime = performance.now() - this.profileFetchStart;
    }
  },

  startDashboardInit() {
    if (this.dashboardInitStart === 0) {
      this.dashboardInitStart = performance.now();
    }
  },
  endDashboardInit() {
    if (this.dashboardInitStart > 0 && this.dashboardLoadTime === 0) {
      this.dashboardLoadTime = performance.now() - this.dashboardInitStart;
      this.printReport();
    }
  },

  trackQuery(queryStr: string) {
    this.firestoreReads++;
    if (this.queryLog.has(queryStr)) {
      this.duplicateQueries++;
      console.warn(`[PERF] Duplicate query detected: ${queryStr}`);
    } else {
      this.queryLog.add(queryStr);
    }
  },

  printReport() {
    console.log('====== PERFORMANCE REPORT ======');
    console.log(`Auth Time: ${this.authTime.toFixed(2)} ms`);
    console.log(`Profile Fetch Time: ${this.profileFetchTime.toFixed(2)} ms`);
    console.log(`Dashboard Load Time: ${this.dashboardLoadTime.toFixed(2)} ms`);
    console.log(`Number of Firestore Reads: ${this.firestoreReads}`);
    console.log(`Duplicate Queries Found: ${this.duplicateQueries}`);
    console.log('================================');
  }
};
