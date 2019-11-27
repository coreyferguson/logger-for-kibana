const logger = require('./logger');

describe('logger.js', () => {
  beforeEach(() => {
    logger.removeAllContext();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('set context', () => {
    const info = jest.spyOn(console, 'info').mockImplementation(() => {});
    logger.setContext('tid', '1234');
    logger.setContext('service', 'logger-for-kibana');
    logger.info('logger.info value');
    expect(info).toHaveBeenCalled();
    const message = JSON.parse(info.mock.calls[0][0]);
    expect(message.logger.level).toBe('info');
    expect(message.logger.context).toEqual({
      tid: '1234',
      service: 'logger-for-kibana'
    });
  });

  it('no context by default', () => {
    const info = jest.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('logger.info value');
    expect(info).toHaveBeenCalled();
    const message = JSON.parse(info.mock.calls[0][0]);
    expect(message.logger.context).toEqual({});
  });

});