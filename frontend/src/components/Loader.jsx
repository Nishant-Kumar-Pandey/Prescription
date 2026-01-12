const Loader = ({ message = "Processing..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-medical-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-medical-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-medical-primary font-medium animate-pulse">{message}</p>
        </div>
    );
};

export default Loader;
