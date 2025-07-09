const launchSoonAnnouncement = {
  title: 'An updated Key Worker service will launch soon',
  html: 'You can find out more on <a target="_blank" href="https://justiceuk.sharepoint.com/sites/prisons-digital/SitePages/Keyworker.aspx">SharePoint</a>.',
}

// eslint-disable-next-line import/prefer-default-export
export const homepageAnnouncement = {
  DEV: {
    MDI: launchSoonAnnouncement,
  },
  'PRE-PRODUCTION': {
    BCI: launchSoonAnnouncement,
    HII: launchSoonAnnouncement,
    LFI: launchSoonAnnouncement,
    LPI: launchSoonAnnouncement,
    PNI: launchSoonAnnouncement,
    RSI: launchSoonAnnouncement,
    WMI: launchSoonAnnouncement,
  },
  PRODUCTION: {
    BCI: launchSoonAnnouncement,
    HII: launchSoonAnnouncement,
    LFI: launchSoonAnnouncement,
    LPI: launchSoonAnnouncement,
    PNI: launchSoonAnnouncement,
    RSI: launchSoonAnnouncement,
    WMI: launchSoonAnnouncement,
  },
}
