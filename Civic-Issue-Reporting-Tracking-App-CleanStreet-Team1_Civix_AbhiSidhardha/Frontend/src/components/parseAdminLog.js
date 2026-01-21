export function parseAdminLog(action) {
  const text = action.toLowerCase();

  return {
    isIssueCreated: text.includes('created issue'),
    isIssueUpdated: text.includes('updated issue'),
    isIssueDeleted: text.includes('deleted issue'),

    isAssigned: text.includes('assigned issue') || text.includes('changed assignment'),

    isRoleChanged: text.includes('changed role of user'),

    mentionsUser: username => text.includes(username.toLowerCase()),

    mentionsIssue: issueTitle => issueTitle && text.includes(issueTitle.toLowerCase()),
  };
}
