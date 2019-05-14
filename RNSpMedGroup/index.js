/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Navigator from "./src";
// import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Navigator); //=> App
