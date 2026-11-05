// Import the necessary function from the React library
import { createRoot } from "react-dom/client";

import { Library } from "./Library.jsx";

// A "root" is the container for a React app. We need
// a piece of HTML for the app to live in, so we use the
// div from our index.html file
let root = createRoot(document.getElementById("archive"));

// This function tells React to render content in our application.
// JSX allows us to use tags like these as a simple template language.
root.render(<Library />);
