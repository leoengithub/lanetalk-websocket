import { useEffect, useState } from 'react';
import { Centrifuge, PublicationContext } from 'lanetalk-centrifuge-js';

const useCentrifuge = ({
  url,
  channel,
  apiKey,
  debug = false,
}: {
  url: string;
  channel: string;
  apiKey: string;
  debug: boolean;
}) => {
  const [isConnected, setConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<PublicationContext>();

  //       centrifuge.on('connecting', function (ctx) {
  //         console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
  //       }).on('connected', function (ctx) {
  //         console.log(`connected over ${ctx.transport}`);
  //       }).on('disconnected', function (ctx) {
  //         console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
  //       }).connect();

  //       sub.on('publication', function (ctx) {
  //           console.log(ctx);
  //         }).on('subscribing', function (ctx) {
  //           console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
  //         }).on('subscribed', function (ctx) {
  //           console.log('subscribed', ctx);
  //         }).on('unsubscribed', function (ctx) {
  //           console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
  //         }).subscribe();

  useEffect(() => {
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

    return () => {
      subscription.unsubscribe();
      subscription.removeAllListeners();
      centrifuge.disconnect();
    };
  }, [url, channel, debug, apiKey]);

  return {
    isConnected,
    lastMessage,
  };
};

export default useCentrifuge;
