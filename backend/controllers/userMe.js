const asyncMiddleware = require('../middleware/asyncHandler');

const userMeFactory = (elite2Api, keyworkerApi) => {
  const userMeService = async (context) => {
    const user = await elite2Api.currentUser(context);
    const { activeCaseLoadId } = user;

    const prisonStatus = await keyworkerApi.getPrisonMigrationStatus(context, activeCaseLoadId);
    const roles = await elite2Api.getUserAccessRoles(context);

    const isKeyWorkerAdmin = roles
      .filter(role => role.roleCode === 'OMIC_ADMIN')
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

