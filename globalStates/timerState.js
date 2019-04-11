import {PersistContainer} from 'unstated-persist'
import {Container} from 'unstated'
import {AsyncStorage} from 'react-native'
import {storeData} from '../utils/AsyncStorageHelper'
import {addMinutes} from 'date-fns'

// デバッグしやすいように、マジックナンバーを消す。
const twentyFiveMinutes = __DEV__ ? 5 : 25 * 60
const fiveMinutes = __DEV__ ? 2 : 3 * 60

// timerには、persistを使うには難しい。一旦containerで、実装する。

class timerState extends Container {
  persist = {
    key: 'timerState',
    version: 1,
    storage: AsyncStorage
  }

  // 以下二つは、不必要なrerenerを防ぐために、stateには入れない。
  miliseconds = 0
  timer = null
  state = {
    counter: twentyFiveMinutes,
    startDisabled: true,
    stopDisabled: false,
    isRest: false,
    isRunning: false,
  }

  clearInterval = () => {
    clearInterval(this.timer)
  }

  // 次のタイマーのインターバルに移動する。25 → 5 ➡️ 25
  updateCounterInComponentDidUpdate = () => {
    // 休憩なら5分なので
    const nextInterval = timerState.state.isRest ? twentyFiveMinutes : fiveMinutes
    this.setState({
      counter: nextInterval,
      isRest: !this.state.isRest,
      isRunning: false
    })
  }

  start = () => {
    const nextInterval = this.state.isRest ? twentyFiveMinutes : fiveMinutes
    const activatingAlertTime = addMinutes(new Date(), nextInterval)
    storeData('activatingAlertTime', activatingAlertTime)

    let timer = setInterval(() => {
      this.miliseconds += 1

      // １秒ずつ、インクリメントする。
      if (this.miliseconds == 99 && this.state.counter !== 0) {
        this.miliseconds = 0
        this.setState({ counter: this.state.counter - 1 })
      }

      // もし、counter
      if (this.state.counter === 0 ) {
        this.setState({counter: nextInterval, isRest: !this.state.isRest, isRunning: false})
        this.clearInterval()
      }
    }, 0)
    this.setState({ isRunning: true })
    this.timer = timer
  }

  // setStateを使いやすくした
  setTimerState = (obj /* object */) => {
    this.setState(obj)
  }

  // clear miliseconds
  clearMiliseconds = () => {
    this.miliseconds = 0
  }
}

export default timerState
