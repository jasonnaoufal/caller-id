/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { resolveHtmlPath } from './util';
import { setupRabbitMQ } from './utils-mq';

const WINDOW_WIDTH_EXPANDED = 350;
const WINDOW_HEIGHT_EXPANDED = 500;
const WINDOW_WIDTH_COLLAPSED = 100;
const WINDOW_HEIGHT_COLLAPSED = 120;

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  //require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH_EXPANDED, // Adjust the width to your desired toast notification size
    height: WINDOW_HEIGHT_EXPANDED, // Adjust the height to your desired toast notification size
    backgroundColor: '#000000',
    frame: false, // Remove window frame (remove if you want a frame)
    alwaysOnTop: true, // Make the window always on top (remove if not needed)
    show: false, // Hide the window initially
    resizable: false, // Allow resizing by code
    maximizable: false, // Prevent maximizing
    minimizable: false, // Prevent minimizing,
    opacity: 0.85,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = width - mainWindow.getBounds().width;
  const y = height - mainWindow.getBounds().height;
  mainWindow.setPosition(x, y);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

function toggleAppVisibility(keepExpanded: boolean) {
  if (mainWindow) {

    mainWindow.setResizable(true);
    const { width: currentWidth, height: currentHeight } =
      mainWindow.getBounds();
    const { width: displayWidth, height: displayHeight } =
      screen.getPrimaryDisplay().workAreaSize;

    if (
      currentWidth === WINDOW_WIDTH_COLLAPSED &&
      currentHeight === WINDOW_HEIGHT_COLLAPSED &&
      !keepExpanded
    ) {
      mainWindow.setSize(WINDOW_WIDTH_EXPANDED, WINDOW_HEIGHT_EXPANDED);
      mainWindow.setOpacity(0.85);
    } else {
      mainWindow.setSize(WINDOW_WIDTH_COLLAPSED, WINDOW_HEIGHT_COLLAPSED);
      mainWindow.setOpacity(0.65);
    }

    mainWindow.setPosition(displayWidth - mainWindow.getBounds().width, displayHeight - mainWindow.getBounds().height);
    mainWindow.setResizable(false);
  }
}

/**
 * Add event listeners...
 */

ipcMain.on("minimize", () => {
    toggleAppVisibility(false);
  }
);

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS, it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// @ts-ignore
setupRabbitMQ(mainWindow);
