import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator, {HomeStack} from './MainTabNavigator';

// TODO: 後で、Tabを作成する。
// export default createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Main: MainTabNavigator,
// });

export default HomeStack
