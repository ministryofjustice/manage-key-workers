export type Announcement = {
  title: string
  html: string
}

type AnnouncementConfig = {
  [environment: string]: {
    [caseloadId: string]: Announcement
  }
}

export const homepageAnnouncement: AnnouncementConfig = {
  DEV: {
    MDI: {
      title: 'An updated Key Worker service will launch soon',
      html: 'You can find out more on <a href="#">Sharepoint</a>.',
    },
  },
  'PRE-PRODUCTION': {},
  PRODUCTION: {},
}
