import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomCarousel from "./components/CustomCarousel";

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <CustomCarousel />
        </QueryClientProvider>
    );
}

export default App;
