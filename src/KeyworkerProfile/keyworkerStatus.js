const getStatusStyle = (status) => {
  const statusDescription = getStatusDescription(status);
  const styles = ['inactive', 'active', 'unavailable'];
  let styleClass = "";
  styles.forEach(function (style, index) {
    if (statusDescription && statusDescription.toLowerCase().startsWith(style)) styleClass = style;
  });
  return styleClass;
};

const getStatusDescription = (status) => {
  const styles = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    UNAVAILABLE_ANNUAL_LEAVE: "Unavailable - annual leave",
    UNAVAILABLE_LONG_TERM_ABSENCE: "Unavailable - long term absence",
    UNAVAILABLE_NO_PRISONER_CONTACT: "Unavailable - no prisoner contact"
  };
  return styles[status];
};

const keyworkerStatus = {
  getStatusStyle,
  getStatusDescription
};

module.exports = keyworkerStatus;
