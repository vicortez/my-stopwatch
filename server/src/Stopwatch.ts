import { clearInterval } from 'timers'

export class StopwatchTime {
  constructor(public hours: number = 0, public minutes: number = 0, public seconds: number = 0) {}

  addSecond() {
    this.addSeconds(1)
  }

  addSeconds(secs: number) {
    const total = this.hours * 3600 + this.minutes * 60 + this.seconds + secs
    const h = Math.floor(total / 3600) % 24
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    this.hours = h
    this.minutes = m
    this.seconds = s
    return this
  }

  toString() {
    return `${this.hours.toString().padStart(2, '0')}:${this.minutes
      .toString()
      .padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`
  }
}

export class Stopwatch {
  subscribedEventHandlers: Set<(time: StopwatchTime) => void>
  intervalRef: ReturnType<typeof setInterval> | null = null
  constructor(public stopwatchTime: StopwatchTime = new StopwatchTime()) {
    this.subscribedEventHandlers = new Set()
  }

  isRunning = () => !!this.intervalRef

  subscribe = (cb: (time: StopwatchTime) => void) => {
    this.subscribedEventHandlers.add(cb)
    console.log('New stopwatch subscriber. current sub count: ', this.subscribedEventHandlers.size)

    return () => this.unsubscribe(cb)
  }

  unsubscribe = (cb: (time: StopwatchTime) => void) => {
    this.subscribedEventHandlers.delete(cb)
  }

  private _emit() {
    this.subscribedEventHandlers.forEach((cb) => {
      try {
        cb(this.stopwatchTime)
      } catch (error) {
        console.error("Error executing a subscriver's event handler", error)
        this.unsubscribe(cb)
      }
    })
  }

  play = () => {
    if (this.intervalRef) return
    this.intervalRef = setInterval(() => {
      this.stopwatchTime.addSecond()
      console.debug(`stopwatch running. ${this.stopwatchTime.toString()}`)
      this._emit()
    }, 1000)
  }

  pause = () => {
    if (!this.intervalRef) return
    clearInterval(this.intervalRef)
    this.intervalRef = null
  }

  reset = () => {
    if (this.intervalRef) {
      this.pause()
    }
    this.stopwatchTime = new StopwatchTime()
    this._emit()
  }
}
