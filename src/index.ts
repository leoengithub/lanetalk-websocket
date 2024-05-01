import React from 'react';
import { Centrifuge, PublicationContext, Subscription } from 'lanetalk-centrifuge-js';

const useCentrifuge = ({
  url,
  channel,
  apiKey,
  debug = false,
  ref = null,
}: {
  url: string;
  channel: string;
  apiKey: string;
  debug?: boolean;
  ref?: React.Ref<{
    connection: Centrifuge;
    subscription: Subscription;
  } | null>;
}) => {
  const [isConnected, setConnected] = React.useState<boolean>(false);
  const [lastMessage, setLastMessage] = React.useState<PublicationContext>();
  const centrifugeInstance = React.useRef<{
    connection: Centrifuge;
    subscription: Subscription;
  } | null>(null);

  React.useEffect(() => {
    const centrifuge = new Centrifuge(url, {
      debug,
      data: {
        method: 0,
        params: {
          api_key: apiKey,
        },
      },
    });

    const subscription = centrifuge.newSubscription(channel, {
      data: {
        method: 1,
        params: {
          channel,
        },
      },
    });

    centrifuge
      .on('connected', () => {
        setConnected(true);
      })
      .on('disconnected', () => {
        setConnected(false);
      })
      .connect();

    // subscribe to channel and set last message
    subscription
      .on('publication', function (ctx: PublicationContext) {
        setLastMessage(ctx);
      })
      .subscribe();

    centrifugeInstance.current = {
      connection: centrifuge,
      subscription: subscription,
    };

    return () => {
      subscription.unsubscribe();
      subscription.removeAllListeners();
      centrifuge.disconnect();
    };
  }, [url, channel, debug, apiKey]);

  React.useImperativeHandle(ref, () => centrifugeInstance.current);

  return {
    isConnected,
    lastMessage,
  };
};

export default useCentrifuge;
