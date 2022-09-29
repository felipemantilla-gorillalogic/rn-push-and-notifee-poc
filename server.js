var admin = require('firebase-admin');

var serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const nots = [
  {
    user: {
      name: 'Mike',
      userId: '1',
    },
    message: {
      text: 'Hey everybody',
    },
    channelId: 'nba',
  },
  {
    user: {
      name: 'Jordan',
      userId: '2',
    },
    message: {
      text: 'Hi Mike! ',
    },
    channelId: 'nba',
  },
  {
    user: {
      name: 'Gabe',
      userId: '3',
    },
    message: {
      text: 'How is going?',
    },
    channelId: 'nba',
  },
  {
    user: {
      name: 'Simon',
      userId: '4',
    },
    message: {
      text: 'Good morning ',
    },
    channelId: 'nba',
  },
  {
    user: {
      name: 'Marco',
      userId: '5',
    },
    message: {
      text: 'Wow!!!',
    },
    channelId: 'mlb',
  },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage() {
  // Fetch the tokens from an external datastore (e.g. database)
  const tokens = [
    'eR7AICgXSRSLOySZlx6bJf:APA91bFL0tP7R_sa4HSa41GsMPrEySDBvvURlcYyxxG-bh2oTd1zUOL5bQSF8D1F-VoB2lX6Rb70fYPui7n-iC7sZvnMUQNCSuxP0ymwgZy5psybknwchwR9Qd2p058j3N9XAW2RE5zJ',
  ];

  for (let n of nots) {
    const result = await admin.messaging().sendMulticast({
      tokens,
      data: {
        notification: JSON.stringify(n),
      },
    });
    console.log(result);
    await sleep(3000);
  }
}

// Send messages to our users
sendMessage();
