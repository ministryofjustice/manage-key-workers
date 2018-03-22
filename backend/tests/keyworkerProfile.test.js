Reflect.deleteProperty(process.env, 'APPINSIGHTS_INSTRUMENTATIONKEY');
const profile = require('../controllers/keyworkerProfile').profile;
const keyworkerApi = require('../keyworkerApi');

const req = {
  headers: {
  },
  query: {
  }
};


describe('keyworker profile controller', async () => {
  it('Should add keyworker details to response', async () => {
    keyworkerApi.keyworker = jest
      .fn()
      .mockImplementation(() => createKeyworkerResponse());

    const response = await profile(req);

    expect(keyworkerApi.keyworker.mock.calls.length).toBe(1);

    expect(response.data.firstName).toBe('Another');
    expect(response.data.lastName).toBe('User');
    expect(response.data.staffId).toBe(-5);
    expect(response.data.agencyId).toBe("LEI");
    expect(response.data.capacity).toBe(11);
    expect(response.data.agencyDescription).toBe("LEEDS");
    expect(response.data.numberAllocated).toBe(4);
    expect(response.data.scheduleType).toBe('Full Time');
    expect(response.data.status).toBe('ACTIVE');
  });
});

function createKeyworkerResponse () {
  return {
    data: {
      staffId: -5,
      firstName: "Another",
      lastName: "User",
      capacity: 11,
      numberAllocated: 4,
      scheduleType: "Full Time",
      agencyId: "LEI",
      agencyDescription: "LEEDS",
      status: "ACTIVE"
    }
  };
}


