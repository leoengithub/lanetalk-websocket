import { useEffect, useState } from 'react';
import { Centrifuge, PublicationContext } from 'lanetalk-centrifuge';

const useCentrifuge = ({
  url,
  channel,
  debug = false,
  apiKey,
}: {
  url: string;
  channel: string;
  apiKey: string;
  debug: boolean;
}) => {
  const [isConnected, setConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<PublicationContext>();

  useEffect(() => {
    const centrifuge = new Centrifuge(url, {
      debug,
    });

    const subscription = centrifuge.newSubscription(channel);
    subscription.on('publication', function (ctx) {
      setLastMessage(ctx);
    });

    // start subscription to channel
    subscription.subscribe();

    centrifuge.on('connected', () => {
      setConnected(true);

      centrifuge
        .publish(
          channel,
          JSON.stringify({
            method: 0,
            params: {
              api_key: apiKey,
            },
          })
        )
        .then(() => {
          centrifuge.publish(
            channel,
            JSON.stringify({
              method: 1,
              params: {
                channel,
              },
            })
          );
        })
        .catch((error) => {
          console.error('Error subscribing to a channel message:', error);
        });
    });

    // Handle disconnection
    centrifuge.on('disconnected', () => {
      // onClose();
      setConnected(false);
    });

    // Start the connection
    centrifuge.connect();

    return () => {
      subscription.unsubscribe();
      subscription.removeAllListeners();
      centrifuge.disconnect();
    };
  }, [url, channel, debug]);

  return {
    isConnected,
    lastMessage,
  };
};

export default useCentrifuge;
