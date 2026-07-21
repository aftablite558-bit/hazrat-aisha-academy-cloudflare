# Known Limitations - Hazrat Aisha Academy v1.0.0

## Current Limitations
1. **Offline Mode**: The application currently requires an active internet connection for all dashboard operations. Offline caching is limited.
2. **Large File Uploads**: Extremely large files (e.g., video files over 50MB) may timeout depending on network speed and server configuration.
3. **Real-time Updates**: While changes reflect upon refresh or re-fetch, true real-time WebSockets are not fully implemented for all dashboard modules.
4. **Third-party Integrations**: SMS or Email gateways for automated notifications are stubbed or require manual configuration by the administrator.

## Future Enhancements
- Implementation of a Progressive Web App (PWA) for better offline support.
- Integration of a dedicated payment gateway for fee collection.
- Advanced analytics and reporting dashboards with export-to-Excel capabilities.
