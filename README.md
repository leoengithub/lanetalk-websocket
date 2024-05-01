# Lanetalk WebSocket

This project is a React hook that facilitates connections to a Centrifuge server using websockets.

Under the hood uses a fork of `centrifuge-js`

### Basic Usage of the Hook

To use the `useWebsocket` hook in your React project, follow these steps:

1. **Import the Hook:**
   Depending on your module system, import the hook as shown below:

   - For CommonJS:
     ```javascript
     const useWebsocket = require('lanetalk-websocket');
     ```

   - For ES Modules:
     ```javascript
     import useWebsocket from 'lanetalk-websocket';
     ```

2. **Initialize the Hook:**
   You can initialize the hook by passing the required parameters. Here is an example of how to use it in a functional component:

   ```javascript
   function MyComponent() {
     const { isConnected, lastMessage } = useWebsocket({
       url: 'wss://your-websocket-url',
       apiKey: 'your-api-key',
       channel: 'your-channel-id',
       debug: true,
     });

     return (
       <div>
         <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
         <p>Last Message: {JSON.stringify(lastMessage)}</p>
       </div>
     );
   }
   ```

   In this example:
   - `url`: WebSocket server URL.
   - `apiKey`: API key for authentication.
   - `channel`: The channel you want to subscribe to.
   - `debug`: Enable debug mode for additional logging.

3. **Using the Hook Data:**
   The hook returns an object containing:
   - `isConnected`: A boolean indicating the connection status.
   - `lastMessage`: The last message received from the subscribed channel.

   You can use these values in your component to display connection status or messages as needed.

### Listen on events emits

Here a couple of events you can subscribe on by passinf a ref to get the created instance.

1. First pass a ref prop to get the instance
```
    const { isConnected, lastMessage } = useWebsocket({
       url: 'wss://your-websocket-url',
       apiKey: 'your-api-key',
       channel: 'your-channel-id',
       ref: instanceRef
     });
```


```
     const { connection, subscription } = instanceRef;

      centrifuge.on('connecting', function (ctx) {
          console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
        }).on('connected', function (ctx) {
          console.log(`connected over ${ctx.transport}`);
        }).on('disconnected', function (ctx) {
          console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
        });

        sub.on('publication', function (ctx) {
            console.log(ctx);
          }).on('subscribing', function (ctx) {
            console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
          }).on('subscribed', function (ctx) {
            console.log('subscribed', ctx);
          }).on('unsubscribed', function (ctx) {
            console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
          })
```