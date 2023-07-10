
  
  const express = require('express')
  const bodyPraser = require('body-parser')
  const app = express()
  app.use(bodyPraser.urlencoded({extended: true}))
  app.use(express.json());

const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

  // const exec= require('execa');


  


  const port = process.env.PORT || 8000

  
  app.get('/', (req, res) => {
    res.send('Hello....')
    // buildApk()
    buildAppFlavors()
  });
  

  app.listen(port, ()=>{
      console.log(`Server running at port ${port}`)
  })




 
async function buildAppFlavors() {
  try {
    // Step 1: Update app icons
 
    // Step 2: Update app name
    await updateAppName('flavor1');

    // Step 3: Update splash screen

    // Step 4: Build app
    await buildApp();


    console.log(`App flavor ${'flavor1'} built successfully`);
  } catch (error) {
    console.error(`Error building app flavor ${'flavor1'}:`, error);
  }
}


async function updateAppName(appName) {
  // Update the app name in the appropriate location in your React Native project
  try {
    const appGradleFile = '../android/app/build.gradle';
    let appGradleContent = await promisify(fs.readFile)(appGradleFile, 'utf8');

    appGradleContent = appGradleContent.replace(/app_name\s+".*"/g, `app_name "${appName}"`);

    await promisify(fs.writeFile)(appGradleFile, appGradleContent);
  } catch (error) {
    throw new Error(`Error updating app name: ${error}`);
  }
}

async function buildApp() {
  // Build the React Native app using the desired flavor
  try {
    // buildApk()
    await promisify(exec)('cd ./android && ./gradlew assembleRelease', { cwd: './server' });
    // Replace 'assembleDebug' with 'assembleRelease' if you want to build the release version
  } catch (error) {
    throw new Error(`Error building app: ${error}`);
  }
}




async function buildApk() {

    try {
      // Change the path to your React Native project
      const projectPath = '../';
  
      // Navigate to the React Native project directory
      process.chdir(projectPath);

      // Install project dependencies

      const execaCommand = (await import('execa')).execaCommand;

      await execaCommand('npm install');
      
      console.log("execution start")
      // Build the APK
      await promisify(exec)('cd ./android && ./gradlew assembleRelease', { cwd: './server' });
      
      console.log('APK build completed successfully!');
    } catch (error) {
      console.error('APK build failed:', error);
    }
  }