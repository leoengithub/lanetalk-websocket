import React from 'react';
import {
  Centrifuge,
  PublicationContext,
  Subscription,
} from 'lanetalk-centrifuge-js';

export type RefType = {
  connection: Centrifuge;
  subscription: Subscription;
};

export interface UseCentrifugeProps {
  url: string;
  channel: string;
  apiKey: string;
  debug?: boolean;
  ref?: React.Ref<RefType | null>;
}

const useCentrifuge = ({
  url,
  channel,
  apiKey,
  debug = false,
  ref = null,
}: UseCentrifugeProps) => {
  const [isConnected, setConnected] = React.useState<boolean>(false);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [lastMessage, setLastMessage] = React.useState<PublicationContext>();
  const centrifugeInstance = React.useRef<RefType | null>(null);

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
        // Check if the message is the initialization message (type 2)
        if (ctx.data?.type === 2) {
          setIsInitialized(true);
          return;
        }

        // Only set messages after initialization
        if (isInitialized) {
          setLastMessage(ctx);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, channel, debug, apiKey]);

  React.useImperativeHandle(ref, () => centrifugeInstance.current);

  return {
    isConnected,
    isInitialized,
    lastMessage,
  };
};

export default useCentrifuge;
