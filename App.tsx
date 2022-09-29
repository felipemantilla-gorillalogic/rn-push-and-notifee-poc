import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidMessagingStyle,
  AndroidMessagingStyleMessage,
  AndroidStyle,
} from '@notifee/react-native';

import React, {useEffect} from 'react';
import {Button, SafeAreaView, TextInput, View} from 'react-native';

interface Notification {
  user: {
    name: string;
    userId: string;
    avatar?: string;
  };
  message: {
    text: string;
  };
  channelId: string;
}

const me = {
  name: 'Felipe Mantilla',
  avatar:
    'https://cdnb.artstation.com/p/assets/images/images/006/448/259/large/guilherme-pulga-avatar-gorillaz-3.jpg?1498664766',
  userId: '1',
};

const App = () => {
  const [channelId, setChannelId] = React.useState('default');

  // getting the token

  async function onAppBootstrap() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    console.log(token);
    // Save the token
    // await postToApi('/users/1234/tokens', { token });
  }

  const notificationManagement = async (notification: Notification) => {
    const nots = await notifee.getDisplayedNotifications();

    const prevNot = nots.find(n => n.id === notification.channelId);
    // console.log(prevNot);

    let messages: AndroidMessagingStyleMessage[] = [];
    let currentMessage: AndroidMessagingStyleMessage = {
      text: notification.message.text,
      timestamp: Date.now(),
      person: {
        name: notification.user.name,
        // icon: notification.user.avatar,
        id: notification.user.userId,
      },
    };
    if (prevNot) {
      const styleNot = prevNot.notification.android
        ?.style as AndroidMessagingStyle;

      const prevMessages: AndroidMessagingStyleMessage[] =
        styleNot.messages || [];
      messages = [...prevMessages, currentMessage];
    } else {
      messages = [currentMessage];
    }

    notifee.displayNotification({
      id: notification.channelId,
      android: {
        channelId: 'default', // requried
        style: {
          title: notification.channelId.toUpperCase(),
          group: true,
          type: AndroidStyle.MESSAGING,
          person: {
            // current user
            name: me.name,
            icon: me.avatar,
            id: me.userId,
          },
          messages: messages,
        },
      },
    });
  };

  // general handler for notifications
  const onMessageReceived = async (message: any) => {
    if (message && message.data) {
      const not: Notification = JSON.parse(message.data.notification);

      notificationManagement(not);
    }
  };

  // Notifee setup
  useEffect(() => {
    const initNotifee = async () => {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      notifee.onForegroundEvent(message =>
        console.log('Notifee onForegroundEvent', message),
      );

      notifee.onBackgroundEvent(async message => {
        console.log('Notifee onBackgroundEvent', message);
      });
    };

    initNotifee();
  });

  // firebase Cloud Messaging setup
  useEffect(() => {
    // to get token and print into the console
    onAppBootstrap();
    // message handlers
    messaging().setBackgroundMessageHandler(onMessageReceived);
    const unsubscribe = messaging().onMessage(onMessageReceived);
    // to unsubscribe when component died
    return unsubscribe;
  });

  return (
    <SafeAreaView>
      <View>
        <TextInput
          style={{
            margin: 5,
            borderColor: '#4f4f4f',
            borderWidth: 0.5,
            borderRadius: 10,
          }}
          value={channelId}
          onChange={e => setChannelId(e.nativeEvent.text)}
          placeholder="channelId"
        />
        <Button color={'gray'} title="create channel" onPress={() => notifee} />
      </View>
    </SafeAreaView>
  );
};

export default App;
