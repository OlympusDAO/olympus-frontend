// import toast from "react-hot-toast";
// // List of error messages we wish to intercept
// const interceptedConsoleMessages = ["Wrong network, please switch to mainnet"];
// // Intercepts an error sent to console and dispatches it to the message framework.
// var ConsoleInterceptor = function (message) {
//   if (interceptedConsoleMessages.includes(message)) {
//     toast.error(message);
//   }
//   console._error_old(message);
// };
// ConsoleInterceptor.isInterceptor = true;

// // Replaces the console.error function by our interceptor
// if (console.error.isInterceptor != true) {
//   console._error_old = console.error;
//   console.error = ConsoleInterceptor;
// }
