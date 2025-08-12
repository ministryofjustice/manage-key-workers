const launchSoonAnnouncement = {
  title: 'An updated Key Worker service will launch soon',
  html: 'You can find out more on <a target="_blank" href="https://justiceuk.sharepoint.com/sites/prisons-digital/SitePages/Keyworker.aspx">SharePoint</a>.',
}

const launchedAnnouncement = {
  title: 'You should use the updated Key Worker service',
  html: `You can access this using <a href="${process.env.ALLOCATIONS_UI_URL}/key-worker">this link</a>. You can find out more on <a target="_blank" href="https://justiceuk.sharepoint.com/sites/prisons-digital/SitePages/Keyworker.aspx">SharePoint</a>.`,
}

// eslint-disable-next-line import/prefer-default-export
export const homepageAnnouncement = {
  DEV: {
    MDI: launchedAnnouncement,
    LEI: launchSoonAnnouncement,
  },
  'PRE-PRODUCTION': {
    BCI: launchedAnnouncement,
    HII: launchedAnnouncement,
    LFI: launchedAnnouncement,
    LPI: launchedAnnouncement,
    PNI: launchedAnnouncement,
    RSI: launchedAnnouncement,
    WMI: launchedAnnouncement,
    DWI: launchSoonAnnouncement,
  },
  PRODUCTION: {
    BCI: launchedAnnouncement,
    HII: launchedAnnouncement,
    LFI: launchedAnnouncement,
    LPI: launchedAnnouncement,
    PNI: launchedAnnouncement,
    RSI: launchedAnnouncement,
    WMI: launchedAnnouncement,
    DWI: launchSoonAnnouncement,
  },
}
