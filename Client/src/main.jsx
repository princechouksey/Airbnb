import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {store} from "./store/store.js"
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster, toast } from 'sonner';

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
           <Toaster richColors />
        </BrowserRouter>
    </Provider>
);
