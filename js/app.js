// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';

  /*
  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function () { console.log('Service Worker Registered'); });
  }
  */


  // make the whole serviceworker process into a promise so later on we can
  // listen to it and in case new content is available a toast will be shown
  window.isUpdateAvailable = new Promise(function (resolve, reject) {
    // lazy way of disabling service workers while developing
    // if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
      // register service worker file
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => {
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    // new update available
                    resolve(true);
                  } else {
                    // no update available
                    resolve(false);
                  }
                  break;
              }
            };
          };
        })
        .catch(err => console.error('[SW ERROR]', err));
  // }
  });



  // listen to the service worker promise in index.html to see if there has been a new update.
  // condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
  window['isUpdateAvailable']
    .then(isAvailable => {
      if (isAvailable) {
        // alert("THERE IS AN UPDATE FOUND...Please close your application and re-open.");
        displayNotification()
      }
    });



  Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
  });

  function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        var options = {
          body: 'There is an update available. Please close your app and re-open.',
          icon: 'images/icons/rock-icon.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        };
        reg.showNotification('Rock CMS', options);
      });
    }
  }
  
  
  

  self.addEventListener('install', function (event) {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();

    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
  });





  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    btnAdd.style.display = 'block';
  });


  /*
  btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });

*/

})();
