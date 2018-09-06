const { userMeFactory } = require('../controllers/userMe');

const context = {};
const staffRoles = [
  { roleId: -201, roleCode: 'OMIC_ADMIN', roleName: 'Omic Admin', caseloadId: 'NWEB' }
];
const staff1 = {
  staffId: 1,
  username: "staff1",
  activeCaseLoadId: "LEI",
  maintainAccess: false,
  migration: false
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
    elite2Api.getUserAccessRoles = jest.fn();
    keyworkerApi.getPrisonMigrationStatus = jest.fn();

    elite2Api.currentUser.mockImplementation(() => staff1);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true
    }));
  });

  it('should not have writeAccess when the user does not have the key worker admin role', async () => {
    elite2Api.getUserAccessRoles.mockImplementation(() => []);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: false,
      supported: false,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 1,
      capacityTier1: 1,
      capacityTier2: 2
    }));
    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);
    const data = await userMeService();

    expect(data).toEqual({
      ...staff1,
      writeAccess: false
    });
  });
  it('should have writeAccess when the user has the key worker admin role', async () => {
    elite2Api.getUserAccessRoles.mockImplementation(() => staffRoles);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: true,
      supported: true,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 2,
      capacityTier1: 1,
      capacityTier2: 2
    }));
    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);
    const data = await userMeService(context);

    expect(elite2Api.currentUser).toHaveBeenCalled();
    expect(elite2Api.getUserAccessRoles).toHaveBeenCalledWith(context);

    expect(data).toEqual({
      ...staff1,
      writeAccess: true
    });
  });
  it('should not have writeAccess when the prison has not been migrated regardless of roles', async () => {
    elite2Api.getUserAccessRoles.mockImplementation(() => staffRoles);
    keyworkerApi.getPrisonMigrationStatus.mockImplementation(() => ({
      migrated: false,
      supported: false,
      autoAllocatedSupported: false,
      kwSessionFrequencyInWeeks: 1,
      capacityTier1: 1,
      capacityTier2: 2
    }));

    const { userMeService } = userMeFactory(elite2Api, keyworkerApi);

    const data = await userMeService(context);

    expect(elite2Api.currentUser).toHaveBeenCalled();
    expect(elite2Api.getUserAccessRoles).toHaveBeenCalledWith(context);
    expect(keyworkerApi.getPrisonMigrationStatus).toHaveBeenCalledWith(context, staff1.activeCaseLoadId);

    expect(data).toEqual({
      ...staff1,
      writeAccess: false
    });
  });
});
