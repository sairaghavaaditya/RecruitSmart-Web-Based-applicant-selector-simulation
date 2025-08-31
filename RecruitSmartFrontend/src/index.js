// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));


// Before (React 17 and earlier)
// ReactDOM.render(<App />, document.getElementById('root'));

// After (React 18 and later)
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const rootElement = document.getElementById('root');
// const root = ReactDOM.createRoot(rootElement);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );





import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationProvider } from "./components/NavigationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <NavigationProvider>
            <App />
        </NavigationProvider>
    </React.StrictMode>
);
