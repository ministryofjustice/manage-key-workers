const { userMeFactory } = require('../controllers/userMe');

const context = {};
const staffRoles = [
  { roleId: -201, roleCode: 'KW_ADMIN', roleName: 'Key worker Admin', caseloadId: 'NWEB' }
];
const staff1 = {
  staffId: 1,
  username: "staff1",
  activeCaseLoadId: "LEI"
};

describe('userMe controller', () => {
  const elite2Api = {
    currentUser: () => {},
    getStaffRoles: () => {}
  };
  const keyworkerApi = {
    getPrisonMigrationStatus: () => {}
  };

  beforeEach(function () {
    elite2Api.currentUser = jest.fn();
    elite2Api.getStaffRoles = jest.fn();
    keyworkerApi.getPrisonMigrationStatus = jest.fn();

    elite2Api.currentUser.mockImplementation(() => staff1);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true
    }));
  });

  it('should not have writeAccess when the user does not have the key worker admin role', async () => {
    elite2Api.getStaffRoles.mockImplementation(() => []);

    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);
    const data = await userMeService();

    expect(data).toEqual({
      ...staff1,
      writeAccess: false
    });
  });
  it('should have writeAccess when the user has the key worker admin role', async () => {
    elite2Api.getStaffRoles.mockImplementation(() => staffRoles);

    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);
    const data = await userMeService(context);

    expect(elite2Api.currentUser).toHaveBeenCalled();
    expect(elite2Api.getStaffRoles).toHaveBeenCalledWith(context, staff1.staffId, staff1.activeCaseLoadId);

    expect(data).toEqual({
      ...staff1,
      writeAccess: true
    });
  });
  it('should not have writeAccess when the prison has not been migrated regardless of roles', async () => {
    elite2Api.getStaffRoles.mockImplementation(() => staffRoles);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: false
    }));

    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);

    const data = await userMeService(context);

    expect(elite2Api.currentUser).toHaveBeenCalled();
    expect(elite2Api.getStaffRoles).toHaveBeenCalledWith(context, staff1.staffId, staff1.activeCaseLoadId);
    expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(context, staff1.activeCaseLoadId);

    expect(data).toEqual({
      ...staff1,
      writeAccess: false
    });
  });
});
