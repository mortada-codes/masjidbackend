import * as firebase from 'firebase-admin';
import Expo from 'expo-server-sdk';
var config = {
    apiKey: "AIzaSyCHvtfujf4yjXNpYDqlbdyObydvge9KZaQ",
    authDomain: "universityapp-1ea2a.firebaseapp.com",
    databaseURL: "https://universityapp-1ea2a.firebaseio.com",
    projectId: "universityapp-1ea2a",
    storageBucket: "universityapp-1ea2a.appspot.com",
    messagingSenderId: "369916234288"
  };


 firebase.initializeApp(config);

// Create a new Expo SDK client
let expo = new Expo();

// Create the messages that you want to send to clents


(async ()=>{
    try{
 firebase.database().ref("masjidPro").child("announcement").orderByKey().on("child_added",(snapshot)=>{
    let messages = [];
    const devices =   await firebase.database().ref("masjidPro").child("devices").orderByKey().once("value");
    devices.forEach(function(childSnapshot) {
        // key will be "ada" the first time and "alan" the second time
        var key = childSnapshot.key;
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        messages.push(createMessage(childData,snapshot.child("title"),snapshot.child("details")));
    });
    let chunks = expo.chunkPushNotifications(messages);
 
    for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
        }
      }

})
       
  
  
} catch(err){

   }

})();

function createMessage(token,title,body){
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return {}
      }
    
      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
      messages.push({
        to: token,
        sound: 'default',
        body: title,
        data: { withSome: body },
      })
}


// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).


// (async () => {
//   // Send the chunks to the Expo push notification service. There are
//   // different strategies you could use. A simple one is to send one chunk at a
//   // time, which nicely spreads the load out over time:
//   for (let chunk of chunks) {
//     try {
//       let receipts = await expo.sendPushNotificationsAsync(chunk);
//       console.log(receipts);
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();