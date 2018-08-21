const asyncMiddleware = require('../middleware/asyncHandler');

const userMeFactory = (elite2Api, keyworkerApi) => {
  const userMeService = async (context) => {
    const user = await elite2Api.currentUser(context);
    const { staffId, activeCaseLoadId } = user;

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId);
    const roles = await elite2Api.getStaffRoles(context, staffId, activeCaseLoadId);

    const isKeyWorkerAdmin = roles
      .filter(role => role.roleCode === 'KW_ADMIN')
      .length > 0;

    return {
      ...user,
      writeAccess: Boolean(prisonStatus.migrated && isKeyWorkerAdmin)
    };
  };
  const userMe = asyncMiddleware(async (req, res) => {
    const data = await userMeService(res.locals);
    res.json(data);
  });

  return {
    userMe,
    userMeService
  };
};

module.exports = {
  userMeFactory
};

