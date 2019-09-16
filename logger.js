
class Logger {

  tid(tid) {
    this._tid = tid;
  }

  info(message, props) {
    // Kibana has missing logs when props are of inconsistent types
    if (typeof props === 'string') props = { stringValue: props };
    else if (typeof props === 'number') props = { numberValue: props };
    else if (typeof props === 'boolean') props = { booleanValue: props };
    console.info(JSON.stringify({
      tid: this._tid,
      logger: {
        level: 'info',
        message,
        props: JSON.stringify(props)
      }
    }));
  }

  /**
   * @param {string} name unique name for this operation
   */
  startTimer(name, tid) {
    return new Timer(name, tid || this._tid);
  }

}

class Timer {

  /**
   * @param {string} name Unique name for this use case.
   * @param {string} tid Unique id for this entire transaction.
   */
  constructor(name, tid) {
    if (name === undefined) throw new Error('Timer must have a name');
    if (tid === undefined) throw new Error('Timer must have a tid');
    this._running = true;
    this._name = name;
    this._start = new Date();
    this._tid = tid;
    const payload = {
      perf: {
        timer: {
          name: this._name,
          action: 'start',
          start: this._start.getTime()
        }
      },
      tid: this._tid
    };
    console.info(JSON.stringify(payload));
  }

  /**
   * @param {boolean} success indicates operation completed without unexpected errors
   */
  stop(success) {
    if (success === undefined) success = true;
    if (this._running) {
      this._stop = new Date();
      const timeTaken = this._stop.getTime() - this._start.getTime();
      const payload = {
        perf: {
          timer: {
            name: this._name,
            action: 'stop',
            start: this._start.getTime(),
            stop: this._stop.getTime(),
            time_taken: timeTaken
          },
          resiliency: success
        },
        tid: this._tid
      };
      console.info(JSON.stringify(payload));
      this._running = false;
    } else {
      throw new Error(`Timer '${this._name}' stopped multiple times.`)
    }
  }

}

module.exports = new Logger();
module.exports.Logger = Logger;
