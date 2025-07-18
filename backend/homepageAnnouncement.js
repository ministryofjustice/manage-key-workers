const launchSoonAnnouncement = {
  title: 'You should use the updated Key Worker service',
  html: `You can access this using <a href="${process.env.ALLOCATIONS_UI_URL}">this link</a>. You can find out more on <a target="_blank" href="https://justiceuk.sharepoint.com/sites/prisons-digital/SitePages/Keyworker.aspx">SharePoint</a>.`,
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
